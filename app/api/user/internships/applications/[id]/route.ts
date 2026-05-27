// app/api/user/internships/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/db";
import { internshipApplications, internships, companies, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      roleType: string;
    };
    
    const user = await db.select().from(users).where(eq(users.id, decoded.id));
    return user[0] || null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const applicationId = parseInt(resolvedParams.id);
    
    console.log("Fetching application with ID:", applicationId);
    
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Application ID must be a valid number' },
        { status: 400 }
      );
    }

    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to view application details' },
        { status: 401 }
      );
    }

    // First check if application exists
    const appExists = await db
      .select({ id: internshipApplications.id })
      .from(internshipApplications)
      .where(eq(internshipApplications.id, applicationId))
      .limit(1);

    if (!appExists || appExists.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: `Application with ID ${applicationId} not found` },
        { status: 404 }
      );
    }

    // Fetch full application details
    const result = await db
      .select({
        // Application fields
        id: internshipApplications.id,
        userId: internshipApplications.userId,
        internshipId: internshipApplications.internshipId,
        status: internshipApplications.status,
        rollNo: internshipApplications.rollNo,
        examDate: internshipApplications.examDate,
        certificateUnlocked: internshipApplications.certificateUnlocked,
        certificatePaid: internshipApplications.certificatePaid,
        
        // User fields
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phoneNo,
        userProfile: users.profileImgUrl,
        
        // Internship fields
        internshipTitle: internships.title,
        internshipContent: internships.content,
        internshipDuration: internships.duration,
        internshipActive: internships.active,
        internshipIsLive: internships.isLive,
        internshipLastApplyDate: internships.lastApplyDate,
        internshipCreatedAt: internships.createdAt,
        internshipAutoCancel: internships.autoCancel,
        
        // Company fields
        companyId: companies.id,
        companyName: companies.name,
        companyLogo: companies.logoUrl,
        companyCategory: companies.category,
        companyDescription: companies.description,
        companyVerified: companies.verified,
      })
      .from(internshipApplications)
      .innerJoin(users, eq(internshipApplications.userId, users.id))
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .innerJoin(companies, eq(internships.companyId, companies.id))
      .where(eq(internshipApplications.id, applicationId));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Application details not found' },
        { status: 404 }
      );
    }

    const appData = result[0];

    // Check if application belongs to the user
    if (appData.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to view this application' },
        { status: 403 }
      );
    }

    // Determine if internship is active
    const internshipActive = appData.internshipActive && appData.internshipIsLive;
    
    // Check if last apply date has passed
    const isLastDatePassed = appData.internshipLastApplyDate 
      ? new Date(appData.internshipLastApplyDate) < new Date()
      : false;

    // Format the response
    const formattedApplication = {
      id: appData.id,
      internshipId: appData.internshipId,
      userId: appData.userId,
      status: appData.status,
      rollNo: appData.rollNo,
      examDate: appData.examDate,
      certificateUnlocked: appData.certificateUnlocked,
      certificatePaid: appData.certificatePaid,
      internshipActive: internshipActive && !isLastDatePassed,
      appliedAt: appData.internshipCreatedAt || new Date().toISOString(),
      internship: {
        id: appData.internshipId,
        title: appData.internshipTitle,
        duration: appData.internshipDuration ? `${appData.internshipDuration} weeks` : 'Not specified',
        description: appData.internshipContent || 'No description provided',
        company: appData.companyName,
        companyLogo: appData.companyLogo,
        location: appData.companyCategory || 'Remote',
        lastApplyDate: appData.internshipLastApplyDate,
        autoCancel: appData.internshipAutoCancel,
        companyVerified: appData.companyVerified,
        companyDescription: appData.companyDescription,
      },
      user: {
        id: appData.userId,
        name: appData.userName,
        email: appData.userEmail,
        phone: appData.userPhone,
        profile: appData.userProfile,
      },
    };

    return NextResponse.json({
      success: true,
      application: formattedApplication,
    });
  } catch (error) {
    console.error('Error fetching application details:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Failed to fetch application details' 
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint for updating application status (for managers)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const applicationId = parseInt(resolvedParams.id);
    
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Application ID must be a valid number' },
        { status: 400 }
      );
    }

    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to update application' },
        { status: 401 }
      );
    }

    // Check if user is manager
    if (user.roleType !== 'manager') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only managers can update application status' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, examDate, feedback } = body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid Status', message: 'Status must be pending, accepted, rejected, or completed' },
        { status: 400 }
      );
    }

    // Check if application exists
    const application = await db
      .select()
      .from(internshipApplications)
      .where(eq(internshipApplications.id, applicationId))
      .limit(1);

    if (!application || application.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Application not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (examDate) updateData.examDate = new Date(examDate);
    // feedback would need a column in the table, skip for now

    const [updatedApplication] = await db
      .update(internshipApplications)
      .set(updateData)
      .where(eq(internshipApplications.id, applicationId))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to update application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}