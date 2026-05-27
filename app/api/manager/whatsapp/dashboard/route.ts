// app/api/manager/whatsapp/dashboard/route.ts - Fixed
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappConversations, whatsappMessages, whatsappTemplates } from "@/db/schema";
import { eq, desc, inArray, and } from "drizzle-orm";
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
        recentConversations: [],
        recentActivities: [],
      });
    }

    // Get stats - iterate through each account since Drizzle doesn't support IN with OR easily
    let totalConversations = 0;
    let unreadMessages = 0;
    let totalMessages = 0;

    for (const accountId of accountIds) {
      const conversations = await db
        .select()
        .from(whatsappConversations)
        .where(eq(whatsappConversations.whatsappAccountId, accountId));
      
      totalConversations += conversations.length;
      unreadMessages += conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    }

    // Get total messages
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

    // Get recent conversations - collect from all accounts and sort manually
    let allConversations: any[] = [];
    for (const accountId of accountIds) {
      const conversations = await db
        .select()
        .from(whatsappConversations)
        .where(eq(whatsappConversations.whatsappAccountId, accountId))
        .orderBy(desc(whatsappConversations.lastMessageAt))
        .limit(5);
      
      allConversations = [...allConversations, ...conversations];
    }
    
    // Sort and take top 10
    const recentConversations = allConversations
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      .slice(0, 10);

    // Get recent messages as activities
    let allMessages: any[] = [];
    for (const accountId of accountIds) {
      const messages = await db
        .select()
        .from(whatsappMessages)
        .where(eq(whatsappMessages.whatsappAccountId, accountId))
        .orderBy(desc(whatsappMessages.createdAt))
        .limit(5);
      
      allMessages = [...allMessages, ...messages];
    }
    
    // Sort and take top 5
    const recentMessages = allMessages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentActivities = recentMessages.map((msg: any) => ({
      id: msg.id,
      type: msg.direction === 'outgoing' ? 'message_sent' : 'message_received',
      title: msg.direction === 'outgoing' ? 'Message Sent' : 'Message Received',
      description: msg.textBody?.substring(0, 50) || 'Media message',
      time: msg.createdAt,
    }));

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
      recentConversations,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}