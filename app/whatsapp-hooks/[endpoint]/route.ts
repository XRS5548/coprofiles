// app/whatsapp-hooks/[endpoint]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

import {
  whatsappAccounts,
  whatsappWebhookLogs,
  whatsappMessages,
  whatsappConversations
} from "@/db/schema";

import {
  eq,
  and
} from "drizzle-orm";

const VERIFY_TOKEN =
process.env.WHATSAPP_VERIFY_TOKEN!;



/*
=========================
VERIFY WEBHOOK
=========================
*/

export async function GET(
req:NextRequest,
{
params
}:{
params:Promise<{
endpoint:string
}>
}
){

try{

const {endpoint}
=
await params;


const mode=
req.nextUrl.searchParams.get(
"hub.mode"
);

const token=
req.nextUrl.searchParams.get(
"hub.verify_token"
);

const challenge=
req.nextUrl.searchParams.get(
"hub.challenge"
);



const account=
await db
.select()
.from(
whatsappAccounts
)
.where(
eq(
whatsappAccounts.webhookEndpoint,
endpoint
)
)
.limit(1);



if(
!account.length
){

return new Response(
"Webhook not found",
{
status:404
}
);

}



if(
mode==="subscribe"
&&
token===VERIFY_TOKEN
){

console.log(
"Webhook verified"
);

return new Response(
challenge || "",
{
status:200,
headers:{
"Content-Type":
"text/plain"
}
}
);

}


return new Response(
"Verification failed",
{
status:403
}
);

}
catch(err){

console.log(
"GET webhook error:",
err
);

return new Response(
"Server Error",
{
status:500
}
);

}

}



/*
=========================
RECEIVE MESSAGES
=========================
*/

export async function POST(
req:NextRequest,
{
params
}:{
params:Promise<{
endpoint:string
}>
}
){

try{

const {endpoint}
=
await params;


const body=
await req.json();



console.log(
"WEBHOOK RECEIVED:",
JSON.stringify(
body,
null,
2
)
);



const account=
await db
.select()
.from(
whatsappAccounts
)
.where(
eq(
whatsappAccounts.webhookEndpoint,
endpoint
)
)
.limit(1);



if(
!account.length
){

return NextResponse.json(
{
error:
"Webhook account not found"
},
{
status:404
}
);

}



const whatsappAccount=
account[0];



await db.insert(
whatsappWebhookLogs
)
.values({

whatsappAccountId:
whatsappAccount.id,

webhookEvent:
body?.entry?.[0]
?.changes?.[0]
?.field || "unknown",

requestBody:
JSON.stringify(
body
),

processed:true

});



const value=
body?.entry?.[0]
?.changes?.[0]
?.value;



/*
=====================
STATUS UPDATE
=====================
*/


const status=
value?.statuses?.[0];


if(status){

console.log(
"STATUS UPDATE",
status
);


await db
.update(
whatsappMessages
)
.set({

status:
status.status === "read"
?"read"
:status.status === "delivered"
?"delivered"
:"sent"

})
.where(
eq(
whatsappMessages
.waMessageId,
status.id
)
);


return NextResponse.json({
success:true
});

}



/*
=====================
NEW MESSAGE
=====================
*/


const message=
value?.messages?.[0];

if(!message){

return NextResponse.json({
success:true
});

}


console.log(
"NEW MESSAGE:",
message
);



const allowedTypes=[

"text",
"image",
"video",
"audio",
"document",
"location",
"contact",
"interactive",
"template",
"sticker",
"reaction"

] as const;

type WhatsAppMessageType = typeof allowedTypes[number];


const messageType: WhatsAppMessageType =
(allowedTypes as readonly string[]).includes(
message.type
)
?
message.type as WhatsAppMessageType
:
"text";



let textBody="";
let mediaId:string | null=null;
let mediaMimeType:string | null=null;
let caption:string | null=null;
let lastMessagePreview="";
let fileName:string | null=null;


if(
message.type==="text"
){

textBody=
message.text?.body || "";

}


if(
message.type==="button"
){

textBody=
message.button?.text || "";

}

if(message.type==="image"){
mediaId=message.image?.id || null;
mediaMimeType=message.image?.mime_type || null;
caption=message.image?.caption || null;
}

if(message.type==="video"){
mediaId=message.video?.id || null;
mediaMimeType=message.video?.mime_type || null;
caption=message.video?.caption || null;
}

if(message.type==="audio"){
mediaId=message.audio?.id || null;
mediaMimeType=message.audio?.mime_type || null;
}

if(message.type==="document"){
mediaId=message.document?.id || null;
mediaMimeType=message.document?.mime_type || null;
caption=message.document?.caption || null;
fileName=message.document?.filename || null;
}

lastMessagePreview=
textBody ||
caption ||
fileName ||
(message.type==="image" ? "Image message" :
message.type==="video" ? "Video message" :
message.type==="audio" ? "Audio message" :
message.type==="document" ? "Document message" :
`${messageType} message`);



try{


await db
.insert(
whatsappMessages
)
.values({

whatsappAccountId:
whatsappAccount.id,

messageId:
message.id ||
`msg_${Date.now()}`,

waMessageId:
message.id,

fromNumber:
message.from,

toNumber:
whatsappAccount.phoneNumber,

messageType:
messageType,

direction:
"incoming",

status:
"delivered",

textBody:
textBody,

mediaId:
mediaId,

mediaMimeType:
mediaMimeType,

caption:
caption,

metadata:{

timestamp:
message.timestamp,

profileName:
value?.contacts?.[0]
?.profile?.name

,

fileName:
fileName

},

createdAt:
new Date()

})
.returning();



console.log(
"Message saved"
);



const existing=
await db
.select()
.from(
whatsappConversations
)
.where(
and(
eq(
whatsappConversations
.whatsappAccountId,
whatsappAccount.id
),

eq(
whatsappConversations
.customerNumber,
message.from
)
)
)
.limit(1);



if(
existing.length
){

await db
.update(
whatsappConversations
)
.set({

lastMessageAt:
new Date(),

lastMessagePreview:
lastMessagePreview,

totalMessages:
(existing[0]
.totalMessages ||0)+1,

updatedAt:
new Date()

})
.where(
eq(
whatsappConversations.id,
existing[0].id
)
);

}
else{

await db
.insert(
whatsappConversations
)
.values({

whatsappAccountId:
whatsappAccount.id,

customerNumber:
message.from,

customerName:
value?.contacts?.[0]
?.profile?.name,

totalMessages:1,

lastMessagePreview:
lastMessagePreview,

lastMessageAt:
new Date()

});

}


}
catch(dbErr){

console.log(
"DB INSERT ERROR:",
dbErr
);

}


return NextResponse.json({

success:true

});

}
catch(error){

console.log(
"POST WEBHOOK ERROR:",
error
);

return NextResponse.json(
{
error:
error instanceof Error
?error.message
:"Webhook failed"
},
{
status:500
}
);

}

}
