// app/api/user/certificates/route.ts
import { db } from "@/db";
import { certificates, internshipApplications, internships, companies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

    // Fetch all certificates for the user
    const userCertificates = await db
      .select({
        id: certificates.id,
        internshipApplicationId: certificates.internshipApplicationId,
        pdfUrl: certificates.pdfUrl,
        certificateNumber: certificates.certificateNumber,
        userName: certificates.userName,
        internshipTitle: certificates.internshipTitle,
        companyName: certificates.companyName,
        issueDate: certificates.issueDate,
        status: certificates.status,
        verificationCode: certificates.verificationCode,
        createdAt: certificates.createdAt,
      })
      .from(certificates)
      .innerJoin(
        internshipApplications,
        eq(certificates.internshipApplicationId, internshipApplications.id)
      )
      .where(eq(internshipApplications.userId, decoded.id))
      .orderBy(desc(certificates.issueDate));

    return NextResponse.json({
      success: true,
      certificates: userCertificates,
      count: userCertificates.length,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}