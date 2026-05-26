// app/api/manager/internships/[id]/route.ts - Fixed version
import { db } from "@/db";
import { internships, companies, internshipApplications, users, roles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    console.log("Received params:", resolvedParams);
    console.log("ID value:", id);
    
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse ID properly
    const internshipId = parseInt(id);
    if (isNaN(internshipId)) {
      console.error("Invalid ID:", id);
      return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
    }

    console.log("Parsed internshipId:", internshipId);

    // Get internship with company details using raw SQL to avoid Drizzle issues
    const query = `
      SELECT 
        i.id,
        i.title,
        i.active,
        i.is_live as "isLive",
        i.last_apply_date as "lastApplyDate",
        i.duration,
        i.auto_cancel as "autoCancel",
        i.created_at as "createdAt",
        i.content,
        i.company_id as "companyId",
        c.name as "companyName",
        c.logo_url as "companyLogo",
        c.description as "companyDescription"
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.id = ${internshipId}
    `;
    
    const result = await db.execute(sql.raw(query));
    const internship = (result as any)[0];

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    // Get applications count
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM internship_applications 
      WHERE internship_id = ${internshipId}
    `;
    const countResult = await db.execute(sql.raw(countQuery));
    const applicationsCount = (countResult as any)[0]?.count || 0;

    // Get applications list
    const appsQuery = `
      SELECT 
        ia.id,
        u.name as "userName",
        u.email as "userEmail",
        ia.roll_no as "rollNo",
        ia.status,
        ia.certificate_unlocked as "certificateUnlocked",
        ia.certificate_paid as "certificatePaid",
        ia.exam_date as "examDate"
      FROM internship_applications ia
      INNER JOIN users u ON ia.user_id = u.id
      WHERE ia.internship_id = ${internshipId}
      ORDER BY ia.id DESC
      LIMIT 20
    `;
    const appsResult = await db.execute(sql.raw(appsQuery));
    const applications = Array.isArray(appsResult) ? appsResult : [];

    return NextResponse.json({
      success: true,
      internship: {
        ...internship,
        applicationsCount,
      },
      applications,
    });
  } catch (error) {
    console.error("Error fetching internship:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}