// app/api/payments/create-certificate-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { internshipApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { applicationId, amount } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Verify application exists and belongs to user
    const application = await db
      .select()
      .from(internshipApplications)
      .where(eq(internshipApplications.id, applicationId))
      .limit(1);

    if (!application || application.length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application[0].userId !== decoded.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check if already paid
    if (application[0].certificatePaid) {
      return NextResponse.json(
        { error: "Certificate already paid for" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount || 12900, // ₹129 in paise
      currency: "INR",
      receipt: `certificate_${applicationId}_${Date.now()}`,
      notes: {
        applicationId: applicationId.toString(),
        userId: decoded.id.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}