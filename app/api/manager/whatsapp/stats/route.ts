// app/api/manager/whatsapp/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappConversations, whatsappMessages, whatsappTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
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

    // Get all accounts for this user
    const accounts = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.userId, decoded.id));

    const accountIds = accounts.map(a => a.id);

    if (accountIds.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalAccounts: 0,
          activeAccounts: 0,
          totalConversations: 0,
          unreadMessages: 0,
          totalMessages: 0,
          templatesCount: 0,
        },
      });
    }

    // Get conversations
    let totalConversations = 0;
    let unreadMessages = 0;
    for (const accountId of accountIds) {
      const conversations = await db
        .select()
        .from(whatsappConversations)
        .where(eq(whatsappConversations.whatsappAccountId, accountId));
      totalConversations += conversations.length;
      unreadMessages += conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    }

    // Get total messages
    let totalMessages = 0;
    for (const accountId of accountIds) {
      const messages = await db
        .select()
        .from(whatsappMessages)
        .where(eq(whatsappMessages.whatsappAccountId, accountId));
      totalMessages += messages.length;
    }

    // Get templates count
    let templatesCount = 0;
    for (const accountId of accountIds) {
      const templates = await db
        .select()
        .from(whatsappTemplates)
        .where(eq(whatsappTemplates.whatsappAccountId, accountId));
      templatesCount += templates.length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(a => a.status === 'active' && a.verified).length,
        totalConversations,
        unreadMessages,
        totalMessages,
        templatesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching WhatsApp stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
