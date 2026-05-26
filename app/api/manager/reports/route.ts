// app/api/manager/reports/route.ts
import { db } from "@/db";
import { internships, internshipApplications, certificates, roles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const searchParams = request.nextUrl.searchParams;
    const companyId = parseInt(searchParams.get("companyId") || "0");
    const range = searchParams.get("range") || "all";

    // Check permission
    const userRole = await db
      .select()
      .from(roles)
      .where(and(
        eq(roles.userId, decoded.id),
        eq(roles.companyId, companyId)
      ))
      .limit(1);

    if (!userRole || userRole.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build date filter
    let dateFilter = '';
    const now = new Date();
    if (range === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = `AND created_at >= '${start.toISOString()}'`;
    } else if (range === 'last_month') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      dateFilter = `AND created_at >= '${start.toISOString()}' AND created_at <= '${end.toISOString()}'`;
    }

    // Get internships
    const internshipsList = await db
      .select()
      .from(internships)
      .where(eq(internships.companyId, companyId));

    // Get applications
    const applications = await db
      .select()
      .from(internshipApplications)
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .where(eq(internships.companyId, companyId));

    // Get certificates
    const certificatesList = await db
      .select()
      .from(certificates)
      .innerJoin(internshipApplications, eq(certificates.internshipApplicationId, internshipApplications.id))
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .where(eq(internships.companyId, companyId));

    const stats = {
      totalInternships: internshipsList.length,
      activeInternships: internshipsList.filter(i => i.active).length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.internship_applications.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.internship_applications.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.internship_applications.status === 'rejected').length,
      completedInternships: applications.filter(a => a.internship_applications.status === 'completed').length,
      certificatesIssued: certificatesList.length,
      certificatesPaid: certificatesList.filter(c => c.certificates.status === 'active').length,
      totalRevenue: certificatesList.filter(c => c.certificates.status === 'active').length * 129,
    };

    return NextResponse.json({
      success: true,
      report: stats,
      monthlyData: [],
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}