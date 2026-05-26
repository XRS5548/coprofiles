// app/api/payments/verify-certificate-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { internshipApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { applicationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!applicationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update application
    await db
      .update(internshipApplications)
      .set({
        certificatePaid: true,
        certificateUnlocked: true,
      })
      .where(eq(internshipApplications.id, applicationId));

    return NextResponse.json({
      success: true,
      message: "Payment verified and certificate unlocked",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}