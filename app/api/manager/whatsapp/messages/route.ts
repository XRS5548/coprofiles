// app/api/manager/whatsapp/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappMessages, whatsappAccounts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const accountId = parseInt(searchParams.get("accountId") || "0");
    const customerNumber = searchParams.get("customerNumber") || "";

    // Verify account ownership
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!account || account.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const messages = await db
      .select()
      .from(whatsappMessages)
      .where(and(
        eq(whatsappMessages.whatsappAccountId, accountId),
        eq(whatsappMessages.fromNumber, customerNumber)
      ))
      .orderBy(desc(whatsappMessages.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}