// app/api/manager/certificates/[id]/status/route.ts
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const certificateId = parseInt(resolvedParams.id);

    if (isNaN(certificateId)) {
      return NextResponse.json(
        { error: "Invalid certificate ID", message: "Certificate ID must be a valid number" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login to continue" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json(
        { error: "Forbidden", message: "Only managers can update certificate status" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['active', 'under_review', 'bounced'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status", message: "Status must be one of: active, under_review, bounced" },
        { status: 400 }
      );
    }

    // Check if certificate exists
    const existingCertificate = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, certificateId))
      .limit(1);

    if (!existingCertificate || existingCertificate.length === 0) {
      return NextResponse.json(
        { error: "Certificate not found", message: "No certificate exists with this ID" },
        { status: 404 }
      );
    }

    // Update certificate status
    const [updatedCertificate] = await db
      .update(certificates)
      .set({ 
        status: status,
        updatedAt: new Date()
      })
      .where(eq(certificates.id, certificateId))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Certificate status updated to ${status} successfully`,
      certificate: updatedCertificate,
    });
  } catch (error) {
    console.error("Error updating certificate status:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Failed to update certificate status" 
      },
      { status: 500 }
    );
  }
}