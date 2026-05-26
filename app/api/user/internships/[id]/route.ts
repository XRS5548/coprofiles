// app/api/user/internships/[id]/route.ts - Fixed for Next.js 15
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/db";
import { internships, internshipApplications, companies, users } from "@/db/schema";
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
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to view internship details' },
        { status: 401 }
      );
    }

    const internshipId = parseInt(resolvedParams.id);
    
    if (isNaN(internshipId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Internship ID must be a valid number' },
        { status: 400 }
      );
    }

    // Fetch internship with company details
    const internship = await db.select({
      id: internships.id,
      title: internships.title,
      active: internships.active,
      isLive: internships.isLive,
      lastApplyDate: internships.lastApplyDate,
      content: internships.content,
      duration: internships.duration,
      autoCancel: internships.autoCancel,
      createdAt: internships.createdAt,
      companyId: internships.companyId,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
      companyVerified: companies.verified,
      companyCategory: companies.category,
      companyDescription: companies.description,
    })
    .from(internships)
    .leftJoin(companies, eq(internships.companyId, companies.id))
    .where(eq(internships.id, internshipId));

    if (!internship || internship.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Internship not found' },
        { status: 404 }
      );
    }

    const internshipData = internship[0];

    // Check if user has applied for this internship
    const application = await db.select()
      .from(internshipApplications)
      .where(and(
        eq(internshipApplications.userId, user.id),
        eq(internshipApplications.internshipId, internshipId)
      ));

    const hasApplied = application && application.length > 0;
    const applicationData = hasApplied ? application[0] : null;

    // Determine if internship is active
    const isActive = internshipData.active && internshipData.isLive;
    
    // Check if last apply date has passed
    const isLastDatePassed = internshipData.lastApplyDate 
      ? new Date(internshipData.lastApplyDate) < new Date()
      : false;

    // Prepare the response
    const internshipDetails = {
      id: internshipData.id,
      title: internshipData.title,
      company: internshipData.companyName,
      companyId: internshipData.companyId,
      companyLogo: internshipData.companyLogo,
      companyVerified: internshipData.companyVerified,
      location: internshipData.companyCategory || 'Remote',
      duration: internshipData.duration ? `${internshipData.duration} weeks` : 'Not specified',
      description: internshipData.content || 'No description provided',
      requirements: [],
      contactEmail: null,
      contactPhone: null,
      startDate: internshipData.createdAt,
      endDate: internshipData.lastApplyDate,
      stipend: null,
      openings: null,
      lastApplyDate: internshipData.lastApplyDate,
      isActive: isActive && !isLastDatePassed,
      hasApplied: hasApplied,
      applicationId: applicationData?.id || null,
      certificateUnlocked: applicationData?.certificateUnlocked || false,
      postedAt: internshipData.createdAt,
      autoCancel: internshipData.autoCancel,
      companyDescription: internshipData.companyDescription,
    };

    return NextResponse.json({
      success: true,
      internship: internshipDetails,
    });
  } catch (error) {
    console.error('Error fetching internship details:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to fetch internship details. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// POST endpoint for applying to internship
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to apply for internship' },
        { status: 401 }
      );
    }

    const internshipId = parseInt(resolvedParams.id);
    
    if (isNaN(internshipId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Internship ID must be a valid number' },
        { status: 400 }
      );
    }

    // Check if internship exists and is active
    const internship = await db.select()
      .from(internships)
      .where(eq(internships.id, internshipId));

    if (!internship || internship.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Internship not found' },
        { status: 404 }
      );
    }

    const internshipData = internship[0];

    // Check if internship is still accepting applications
    const isActive = internshipData.active && internshipData.isLive;
    const isLastDatePassed = internshipData.lastApplyDate 
      ? new Date(internshipData.lastApplyDate) < new Date()
      : false;

    if (!isActive || isLastDatePassed) {
      return NextResponse.json(
        { error: 'Application Closed', message: 'This internship is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await db.select()
      .from(internshipApplications)
      .where(and(
        eq(internshipApplications.userId, user.id),
        eq(internshipApplications.internshipId, internshipId)
      ));

    if (existingApplication && existingApplication.length > 0) {
      return NextResponse.json(
        { error: 'Already Applied', message: 'You have already applied for this internship' },
        { status: 400 }
      );
    }

    // Create application
    const [newApplication] = await db.insert(internshipApplications).values({
      userId: user.id,
      internshipId: internshipId,
      certificateUnlocked: false,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: newApplication.id,
        internshipId: newApplication.internshipId,
        userId: newApplication.userId,
        certificateUnlocked: newApplication.certificateUnlocked,
        appliedAt: new Date(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error applying for internship:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to submit application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint for canceling application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login to cancel application' },
        { status: 401 }
      );
    }

    const internshipId = parseInt(resolvedParams.id);
    
    if (isNaN(internshipId)) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'Internship ID must be a valid number' },
        { status: 400 }
      );
    }

    // Find application
    const application = await db.select()
      .from(internshipApplications)
      .where(and(
        eq(internshipApplications.userId, user.id),
        eq(internshipApplications.internshipId, internshipId)
      ));

    if (!application || application.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete application
    await db.delete(internshipApplications)
      .where(eq(internshipApplications.id, application[0].id));

    return NextResponse.json({
      success: true,
      message: 'Application cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling application:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to cancel application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}