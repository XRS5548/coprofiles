// app/api/manager/certificates/route.ts - Fixed
import { db } from "@/db";
import { certificates, internshipApplications, internships, companies, users, roles } from "@/db/schema";
import { eq, inArray, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface CertificateRow {
  id: number;
  internshipApplicationId: number;
  pdfUrl: string;
  certificateNumber: string;
  userName: string;
  internshipTitle: string;
  companyName: string;
  issueDate: string;
  status: string;
  verificationCode: string;
  createdAt: string;
  updatedAt: string;
  studentEmail: string;
  studentPhone: string | null;
}

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

    // Get company IDs where user is manager
    const userRoles = await db.select({ companyId: roles.companyId }).from(roles).where(eq(roles.userId, decoded.id));
    const companyIds = userRoles.map(r => r.companyId);

    if (companyIds.length === 0) {
      return NextResponse.json({ success: true, certificates: [] });
    }

    // Get certificates for manager's companies
    const query = `
      SELECT 
        c.id,
        c.internship_application_id as "internshipApplicationId",
        c.pdf_url as "pdfUrl",
        c.certificate_number as "certificateNumber",
        c.user_name as "userName",
        c.internship_title as "internshipTitle",
        c.company_name as "companyName",
        c.issue_date as "issueDate",
        c.status,
        c.verification_code as "verificationCode",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        u.email as "studentEmail",
        u.phone_no as "studentPhone"
      FROM certificates c
      INNER JOIN internship_applications ia ON c.internship_application_id = ia.id
      INNER JOIN internships i ON ia.internship_id = i.id
      INNER JOIN users u ON ia.user_id = u.id
      WHERE i.company_id IN (${companyIds.join(',')})
      ORDER BY c.created_at DESC
    `;

    const result = await db.execute(sql.raw(query));
    const rows = result as unknown as CertificateRow[];
    const certificatesList = rows || [];

    return NextResponse.json({
      success: true,
      certificates: certificatesList,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}




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
    const {
      internshipApplicationId,
      pdfUrl,
      certificateNumber,
      userName,
      internshipTitle,
      companyName,
      issueDate,
      verificationCode,
    } = body;

    // Check if certificate with same number or verification code already exists
    const existingCert = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber))
      .limit(1);

    if (existingCert && existingCert.length > 0) {
      return NextResponse.json({ error: "Certificate number already exists" }, { status: 400 });
    }

    const existingCode = await db
      .select()
      .from(certificates)
      .where(eq(certificates.verificationCode, verificationCode))
      .limit(1);

    if (existingCode && existingCode.length > 0) {
      return NextResponse.json({ error: "Verification code already exists" }, { status: 400 });
    }

    // Create certificate
    const [newCertificate] = await db
      .insert(certificates)
      .values({
        internshipApplicationId,
        pdfUrl,
        certificateNumber,
        userName,
        internshipTitle,
        companyName,
        issueDate: new Date(issueDate),
        status: 'active',
        verificationCode,
      })
      .returning();

    // Update application certificate unlocked status
    await db
      .update(internshipApplications)
      .set({ certificateUnlocked: true })
      .where(eq(internshipApplications.id, internshipApplicationId));

    return NextResponse.json({
      success: true,
      message: "Certificate created successfully",
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}