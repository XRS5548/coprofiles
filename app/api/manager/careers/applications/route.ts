// app/api/manager/careers/applications/route.ts
import { db } from "@/db";
import { careerApplications, careers, companies, users, roles } from "@/db/schema";
import { eq, desc, inArray, and, sql } from "drizzle-orm";
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
      return NextResponse.json({ error: "Forbidden - Only managers can access" }, { status: 403 });
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
        applications: [],
        stats: { total: 0, pending: 0, reviewing: 0, shortlisted: 0, interview: 0, accepted: 0, rejected: 0, hired: 0 },
      });
    }

    // Get all career IDs for these companies
    const careersList = await db
      .select({ id: careers.id })
      .from(careers)
      .where(inArray(careers.companyId, companyIds));
    
    const careerIds = careersList.map(c => c.id);

    if (careerIds.length === 0) {
      return NextResponse.json({
        success: true,
        applications: [],
        stats: { total: 0, pending: 0, reviewing: 0, shortlisted: 0, interview: 0, accepted: 0, rejected: 0, hired: 0 },
      });
    }

    // Get all applications with details
    const applications = await db
      .select({
        id: careerApplications.id,
        careerId: careerApplications.careerId,
        careerName: careers.name,
        position: careers.position,
        salary: careers.salary,
        userId: careerApplications.userId,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phoneNo,
        status: careerApplications.status,
        officeId: careerApplications.officeId,
        appliedDate: careerApplications.appliedDate,
        resumeUrl: careerApplications.resumeUrl,
        coverLetter: careerApplications.coverLetter,
        interviewDate: careerApplications.interviewDate,
        feedback: careerApplications.feedback,
        offerLetterUrl: careerApplications.offerLetterUrl,
        joiningDate: careerApplications.joiningDate,
        salaryOffered: careerApplications.salaryOffered,
        companyId: companies.id,
        companyName: companies.name,
        companyLogo: companies.logoUrl,
      })
      .from(careerApplications)
      .innerJoin(careers, eq(careerApplications.careerId, careers.id))
      .innerJoin(companies, eq(careers.companyId, companies.id))
      .innerJoin(users, eq(careerApplications.userId, users.id))
      .where(inArray(careers.id, careerIds))
      .orderBy(desc(careerApplications.appliedDate));

    // Calculate stats
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      interview: applications.filter(app => app.status === 'interview').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length,
    };

    return NextResponse.json({
      success: true,
      applications,
      stats,
    });
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// PATCH endpoint to update application status
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden - Only managers can update" }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, status, interviewDate, feedback, salaryOffered, offerLetterUrl, joiningDate } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    // Check if application exists and user has permission
    const applicationCheck = await db
      .select({
        careerId: careerApplications.careerId,
        companyId: careers.companyId,
      })
      .from(careerApplications)
      .innerJoin(careers, eq(careerApplications.careerId, careers.id))
      .where(eq(careerApplications.id, applicationId))
      .limit(1);

    if (!applicationCheck || applicationCheck.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const { companyId } = applicationCheck[0];

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
      return NextResponse.json({ error: "You don't have permission for this application" }, { status: 403 });
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (interviewDate !== undefined) updateData.interviewDate = interviewDate ? new Date(interviewDate) : null;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (salaryOffered !== undefined) updateData.salaryOffered = salaryOffered;
    if (offerLetterUrl !== undefined) updateData.offerLetterUrl = offerLetterUrl;
    if (joiningDate !== undefined) updateData.joiningDate = joiningDate ? new Date(joiningDate) : null;

    // Update application
    const [updatedApplication] = await db
      .update(careerApplications)
      .set(updateData)
      .where(eq(careerApplications.id, applicationId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}