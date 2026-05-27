// app/api/manager/whatsapp/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappConversations, whatsappAccounts } from "@/db/schema";
import { eq, and, like, desc, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  roleType: string;
}

interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  success: boolean;
  conversations: unknown[];
}

type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const token: string | undefined = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.roleType !== 'manager') {
      return NextResponse.json<ApiErrorResponse>({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const accountId: number = parseInt(searchParams.get("accountId") || "0");
    const status: string = searchParams.get("status") || "all";
    const search: string = searchParams.get("search") || "";

    if (isNaN(accountId) || accountId === 0) {
      return NextResponse.json<ApiErrorResponse>({ error: "Invalid account ID" }, { status: 400 });
    }

    // Verify account ownership
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!account || account.length === 0) {
      return NextResponse.json<ApiErrorResponse>({ error: "Account not found" }, { status: 404 });
    }

    // Build the query properly
    let query: any = db.select().from(whatsappConversations);
    query = query.where(eq(whatsappConversations.whatsappAccountId, accountId));

    if (search) {
      query = query.where(like(whatsappConversations.customerNumber, `%${search}%`));
    }

    const conversations = await query.orderBy(desc(whatsappConversations.lastMessageAt));

    // Apply filters in JavaScript since Drizzle's filter chaining can be tricky
    let filteredConversations: unknown[] = conversations;
    if (status === "unread") {
      filteredConversations = conversations.filter((c: any) => (c.unreadCount ?? 0) > 0);
    } else if (status === "read") {
      filteredConversations = conversations.filter((c: any) => (c.unreadCount ?? 0) === 0);
    }

    return NextResponse.json<ApiSuccessResponse>({
      success: true,
      conversations: filteredConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json<ApiErrorResponse>({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}