// app/api/manager/dashboard/stats/route.ts - Fixed SQL IN clause
import { db } from "@/db";
import { internships, internshipApplications, certificates, roles, companies, users } from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
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

    // Get company IDs where user is manager
    const userRoles = await db
      .select({ companyId: roles.companyId })
      .from(roles)
      .where(eq(roles.userId, decoded.id));
    
    const companyIds = userRoles.map(r => r.companyId);

    if (companyIds.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalInternships: 0,
          activeInternships: 0,
          liveInternships: 0,
          totalApplications: 0,
          pendingApplications: 0,
          acceptedApplications: 0,
          rejectedApplications: 0,
          completedInternships: 0,
          certificatesIssued: 0,
          totalRevenue: 0,
          growthRate: 0,
          completionRate: 0,
        },
        recentActivities: [],
        monthlyData: [],
        topInternships: [],
      });
    }

    // Get all internships for these companies using inArray
    const internshipsList = await db
      .select()
      .from(internships)
      .where(inArray(internships.companyId, companyIds));

    const totalInternships = internshipsList.length;
    const activeInternships = internshipsList.filter(i => i.active === true).length;
    const liveInternships = internshipsList.filter(i => i.isLive === true).length;

    // Get all applications
    let totalApplications = 0;
    let pendingApplications = 0;
    let acceptedApplications = 0;
    let rejectedApplications = 0;
    let completedApplications = 0;

    if (internshipsList.length > 0) {
      const internshipIds = internshipsList.map(i => i.id);
      const applications = await db
        .select()
        .from(internshipApplications)
        .where(inArray(internshipApplications.internshipId, internshipIds));
      
      totalApplications = applications.length;
      pendingApplications = applications.filter(a => a.status === 'pending').length;
      acceptedApplications = applications.filter(a => a.status === 'accepted').length;
      rejectedApplications = applications.filter(a => a.status === 'rejected').length;
      completedApplications = applications.filter(a => a.status === 'completed').length;
    }

    // Get certificates
    let certificatesIssued = 0;
    let totalRevenue = 0;

    if (internshipsList.length > 0) {
      const internshipIds = internshipsList.map(i => i.id);
      const allApplications = await db
        .select()
        .from(internshipApplications)
        .where(inArray(internshipApplications.internshipId, internshipIds));
      
      const applicationIds = allApplications.map(a => a.id);
      
      if (applicationIds.length > 0) {
        const certificatesList = await db
          .select()
          .from(certificates)
          .where(inArray(certificates.internshipApplicationId, applicationIds));
        
        certificatesIssued = certificatesList.length;
        totalRevenue = certificatesIssued * 129;
      }
    }

    // Calculate rates
    const acceptanceRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0;
    const growthRate = 23.5; // This would come from comparing with previous period
    const completionRate = totalInternships > 0 ? (completedApplications / totalInternships) * 100 : 0;

    // Get recent activities
    const recentActivities = [];

    if (internshipsList.length > 0) {
      const internshipIds = internshipsList.map(i => i.id);
      const recentApps = await db
        .select({
          id: internshipApplications.id,
          status: internshipApplications.status,
          internshipTitle: internships.title,
          userName: users.name,
        })
        .from(internshipApplications)
        .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
        .innerJoin(users, eq(internshipApplications.userId, users.id))
        .where(inArray(internships.id, internshipIds))
        .orderBy(sql`${internshipApplications.id} DESC`)
        .limit(5);
      
      for (const app of recentApps) {
        recentActivities.push({
          id: app.id,
          type: 'application',
          title: `New application for ${app.internshipTitle}`,
          status: app.status,
          time: 'Just now',
          user: app.userName,
        });
      }
    }

    // Generate monthly data (mock for now)
    const monthlyData = generateMonthlyData();

    // Get top internships
    const topInternships = internshipsList
      .map(i => ({ ...i, applicationsCount: 0 }))
      .sort((a, b) => b.applicationsCount - a.applicationsCount)
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      stats: {
        totalInternships,
        activeInternships,
        liveInternships,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        completedInternships: completedApplications,
        certificatesIssued,
        totalRevenue,
        growthRate,
        completionRate,
      },
      recentActivities,
      monthlyData,
      topInternships,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch dashboard stats",
      stats: {
        totalInternships: 0,
        activeInternships: 0,
        liveInternships: 0,
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        completedInternships: 0,
        certificatesIssued: 0,
        totalRevenue: 0,
        growthRate: 0,
        completionRate: 0,
      },
      recentActivities: [],
      monthlyData: generateMonthlyData(),
      topInternships: [],
    }, { status: 500 });
  }
}

// Helper function to generate monthly data
function generateMonthlyData() {
  return [
    { month: 'Jan', applications: 12, internships: 3, revenue: 1548 },
    { month: 'Feb', applications: 19, internships: 4, revenue: 2451 },
    { month: 'Mar', applications: 15, internships: 3, revenue: 1935 },
    { month: 'Apr', applications: 27, internships: 5, revenue: 3483 },
    { month: 'May', applications: 32, internships: 6, revenue: 4128 },
    { month: 'Jun', applications: 28, internships: 4, revenue: 3612 },
    { month: 'Jul', applications: 35, internships: 7, revenue: 4515 },
    { month: 'Aug', applications: 42, internships: 8, revenue: 5418 },
    { month: 'Sep', applications: 38, internships: 6, revenue: 4902 },
    { month: 'Oct', applications: 45, internships: 9, revenue: 5805 },
    { month: 'Nov', applications: 52, internships: 10, revenue: 6708 },
    { month: 'Dec', applications: 48, internships: 8, revenue: 6192 },
  ];
}