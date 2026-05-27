// app/api/manager/whatsapp/send-message/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  whatsappAccounts,
  whatsappMessages,
  whatsappConversations,
  whatsappTemplates
} from "@/db/schema";

import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { whatsappManager } from "@/lib/whatsapp-client";

export async function POST(
request:NextRequest
){

try{

const token=
request.cookies.get(
"token"
)?.value;


if(!token){

return NextResponse.json(
{
error:"Unauthorized"
},
{
status:401
}
);

}


const decoded=
jwt.verify(
token,
process.env.JWT_SECRET!
) as {
id:number;
roleType:string;
};


if(
decoded.roleType
!=="manager"
){

return NextResponse.json(
{
error:"Forbidden"
},
{
status:403
}
);

}



const{

accountId,
toNumber,
message,
messageType,
templateName

}
=
await request.json();



const account=
await db
.select()
.from(
whatsappAccounts
)
.where(
and(
eq(
whatsappAccounts.id,
accountId
),
eq(
whatsappAccounts.userId,
decoded.id
)
)
)
.limit(1);



if(
!account.length
){

return NextResponse.json(
{
error:
"Account not found"
},
{
status:404
}
);

}


let response;
let messageBody=
message;



if(
messageType==="template"
){

if(
!templateName
){

return NextResponse.json(
{
error:
"templateName required"
},
{
status:400
}
);

}

const template=
await db
.select()
.from(
whatsappTemplates
)
.where(
and(
eq(
whatsappTemplates.whatsappAccountId,
accountId
),

eq(
whatsappTemplates.templateName,
templateName
)
)
)
.limit(1);



if(
!template.length
){

return NextResponse.json(
{
error:
"Template not found"
},
{
status:404
}
);

}


messageBody=
template[0]
.bodyText;


response=
await whatsappManager
.sendTemplateMessage(

accountId,

toNumber,

templateName,

template[0]
.language || "en"

);


}else{


response=
await whatsappManager
.sendTextMessage(

accountId,

toNumber,

message

);


}



const existing=
await db
.select()
.from(
whatsappConversations
)
.where(
and(

eq(
whatsappConversations.whatsappAccountId,
accountId
),

eq(
whatsappConversations.customerNumber,
toNumber
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
messageBody,

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
accountId,

customerNumber:
toNumber,

lastMessageAt:
new Date(),

lastMessagePreview:
messageBody,

totalMessages:1

});

}



return NextResponse.json({

success:true,

message:
"Message sent",

response

});


}
catch(error){

console.log(
error
);

return NextResponse.json(
{
error:
error instanceof Error
?error.message
:"Failed"
},
{
status:500
}
);

}

}