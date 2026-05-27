// app/whatsapp-hooks/[endpoint]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  whatsappAccounts,
  whatsappWebhookLogs,
  whatsappMessages
} from "@/db/schema";

import { eq } from "drizzle-orm";

const VERIFY_TOKEN =
process.env.WHATSAPP_VERIFY_TOKEN!;



/*
=========================
GET
Meta Verification
=========================
*/

export async function GET(
req:NextRequest,
{
params
}:{
params:
Promise<{
endpoint:string
}>
}
){

try{

const{
endpoint
}
=
await params;


const mode=
req.nextUrl
.searchParams
.get(
"hub.mode"
);


const token=
req.nextUrl
.searchParams
.get(
"hub.verify_token"
);

const challenge=
req.nextUrl
.searchParams
.get(
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
whatsappAccounts
.webhookEndpoint,
endpoint
)
)
.limit(1);


if(
!account.length
){

return new NextResponse(
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

return new NextResponse(
challenge
);

}


return new NextResponse(
"Verification failed",
{
status:403
}
);

}
catch(error){

console.log(
error
);

return new NextResponse(
"Error",
{
status:500
}
);

}

}




/*
=========================
POST
Receive Messages
=========================
*/

export async function POST(
req:NextRequest,
{
params
}:{
params:
Promise<{
endpoint:string
}>
}
){

try{

const{
endpoint
}
=
await params;


const body=
await req.json();


const account=
await db
.select()
.from(
whatsappAccounts
)
.where(
eq(
whatsappAccounts
.webhookEndpoint,
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
"Webhook not found"
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
"message",

requestBody:
JSON.stringify(
body
),

processed:true

});



const value=
body
?.entry?.[0]
?.changes?.[0]
?.value;


const message=
value
?.messages?.[0];


if(
message
){

await db
.insert(
whatsappMessages
)
.values({

whatsappAccountId:
whatsappAccount.id,

messageId:
message.id,

waMessageId:
message.id,

fromNumber:
message.from,

toNumber:
whatsappAccount.phoneNumber,

messageType:
message.type,

direction:
"incoming",

status:
"delivered",

textBody:
message?.text?.body ||

"",


metadata:{

timestamp:
message.timestamp

}

});

}


return NextResponse.json({

success:true

});

}
catch(error){

console.log(
"webhook error",
error
);

return NextResponse.json(
{
error:
"Webhook failed"
},
{
status:500
}
);

}

}