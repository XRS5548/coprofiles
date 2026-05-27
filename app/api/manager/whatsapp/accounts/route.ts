// app/api/manager/whatsapp/accounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// GET - Fetch all WhatsApp accounts for the manager
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

    const accounts = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.userId, decoded.id))
      .orderBy(whatsappAccounts.createdAt);

    return NextResponse.json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

// POST - Create a new WhatsApp account
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

    const body = await request.json();
    const { accountName, phoneNumberId, phoneNumber, accessToken, businessAccountId } = body;

    // Validate required fields
    if (!accountName || !phoneNumberId || !phoneNumber || !accessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique webhook endpoint
    const webhookId = crypto.randomBytes(16).toString("hex");
    const webhookEndpoint = `${webhookId}`;
    const webhookSecret = crypto.randomBytes(32).toString("hex");

    // Create account
    const [account] = await db
      .insert(whatsappAccounts)
      .values({
        userId: decoded.id,
        accountName,
        phoneNumberId,
        phoneNumber,
        accessToken,
        businessAccountId: businessAccountId || null,
        webhookEndpoint,
        webhookSecret,
        status: "pending",
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Verify the token by testing the API
    try {
      const testResponse = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (testResponse.ok) {
        await db
          .update(whatsappAccounts)
          .set({
            status: "active",
            verified: true,
            lastConnected: new Date(),
          })
          .where(eq(whatsappAccounts.id, account.id));
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp account created successfully",
      account: {
        ...account,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}${webhookEndpoint}`,
      },
    });
  } catch (error) {
    console.error("Error creating WhatsApp account:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

// PUT - Update WhatsApp account
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { accountId, accountName, phoneNumber, accessToken } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };
    if (accountName) updateData.accountName = accountName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (accessToken) {
      updateData.accessToken = accessToken;
      updateData.status = "pending";
      updateData.verified = false;
    }

    const [updatedAccount] = await db
      .update(whatsappAccounts)
      .set(updateData)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Account updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating WhatsApp account:", error);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

// DELETE - Delete WhatsApp account
export async function DELETE(request: NextRequest) {
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
    const accountId = parseInt(searchParams.get("id") || "0");

    await db
      .delete(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)));

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting WhatsApp account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}