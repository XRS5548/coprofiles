// app/api/manager/company/[id]/stats/route.ts
import { db } from "@/db";
import { internships, internshipApplications, careerApplications, careers, roles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const companyId = parseInt(resolvedParams.id);

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if user has access to this company
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

    // Get internships stats
    const internshipsList = await db
      .select()
      .from(internships)
      .where(eq(internships.companyId, companyId));

    const totalInternships = internshipsList.length;
    const activeInternships = internshipsList.filter(i => i.active === true).length;

    // Get applications count
    const internshipIds = internshipsList.map(i => i.id);
    let totalApplications = 0;
    
    if (internshipIds.length > 0) {
      const applications = await db
        .select()
        .from(internshipApplications)
        .where(sql`${internshipApplications.internshipId} IN (${internshipIds.join(',')})`);
      totalApplications = applications.length;
    }

    // Get careers stats
    const careersList = await db
      .select()
      .from(careers)
      .where(eq(careers.companyId, companyId));

    const totalCareers = careersList.length;

    // Get hired count from career applications
    let totalHired = 0;
    if (careersList.length > 0) {
      const careerIds = careersList.map(c => c.id);
      const hired = await db
        .select()
        .from(careerApplications)
        .where(and(
          sql`${careerApplications.careerId} IN (${careerIds.join(',')})`,
          eq(careerApplications.status, 'hired')
        ));
      totalHired = hired.length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalInternships,
        activeInternships,
        totalApplications,
        totalCareers,
        totalHired,
      },
    });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}