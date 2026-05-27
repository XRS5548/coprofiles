// app/api/manager/whatsapp/messages/route.ts - Fixed version
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappMessages, whatsappAccounts } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
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

    if (isNaN(accountId) || accountId === 0) {
      return NextResponse.json({ error: "Invalid account ID" }, { status: 400 });
    }

    if (!customerNumber) {
      return NextResponse.json({ error: "Customer number is required" }, { status: 400 });
    }

    // Verify account ownership
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.id, accountId))
      .limit(1);

    if (!account || account.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (account[0].userId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get messages where customer is either sender or receiver
    const messages = await db
      .select()
      .from(whatsappMessages)
      .where(
        and(
          eq(whatsappMessages.whatsappAccountId, accountId),
          or(
            eq(whatsappMessages.fromNumber, customerNumber),
            eq(whatsappMessages.toNumber, customerNumber)
          )
        )
      )
      .orderBy(whatsappMessages.createdAt);

    console.log(`Found ${messages.length} messages for customer ${customerNumber}`);

    return NextResponse.json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}