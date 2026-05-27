// app/api/manager/whatsapp/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { accountId, newAccessToken } = await request.json();

    if (!accountId || !newAccessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the new token
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!account || account.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Test the token
    const testResponse = await fetch(
      `https://graph.facebook.com/v18.0/${account[0].phoneNumberId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
    );

    if (!testResponse.ok) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 400 });
    }

    // Update token
    const [updatedAccount] = await db
      .update(whatsappAccounts)
      .set({
        accessToken: newAccessToken,
        status: "active",
        verified: true,
        lastConnected: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(whatsappAccounts.id, accountId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      account: updatedAccount,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}