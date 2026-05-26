// app/api/user/certificates/[id]/download/route.ts - Fixed for Next.js 15
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

interface CertificateDownload {
  pdf_url: string;
  certificate_number: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const certificateId = parseInt(resolvedParams.id);

    if (isNaN(certificateId)) {
      return NextResponse.json({ error: "Invalid certificate ID" }, { status: 400 });
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get certificate PDF URL
    const query = `
      SELECT c.pdf_url, c.certificate_number
      FROM certificates c
      WHERE c.id = ${certificateId}
    `;
    
    const result = await db.execute(sql.raw(query));
    const rows = result as unknown as CertificateDownload[];
    const certificate = rows[0];

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Here you would generate or fetch the actual PDF file
    return NextResponse.json({
      success: true,
      message: "Certificate ready for download",
      certificateNumber: certificate.certificate_number,
      pdfUrl: certificate.pdf_url,
    });
  } catch (error) {
    console.error("Error downloading certificate:", error);
    return NextResponse.json({ error: "Failed to download certificate" }, { status: 500 });
  }
}