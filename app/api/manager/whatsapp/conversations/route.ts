// app/api/manager/whatsapp/conversations/route.ts

import { NextRequest,NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappConversations } from "@/db/schema";
import { eq,desc } from "drizzle-orm";

export async function GET(
req:NextRequest
){

const accountId=
Number(
req.nextUrl.searchParams.get(
"accountId"
)
);

const conversations=
await db
.select()
.from(
whatsappConversations
)
.where(
eq(
whatsappConversations.whatsappAccountId,
accountId
)
)
.orderBy(
desc(
whatsappConversations.lastMessageAt
)
);

return NextResponse.json({
success:true,
conversations
});

}