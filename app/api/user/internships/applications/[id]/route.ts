// app/api/user/internships/applications/[id]/route.ts - Updated with new fields
import { db } from "@/db";
import { internshipApplications, internships, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Handle both sync and async params (Next.js 15+)
        const params = await Promise.resolve(context.params);
        const id = params.id;
        
        console.log('Received ID:', id);
        
        // Get and verify token
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };
        
        // Parse the application ID from params - handle both string and number
        let applicationId: number;
        
        if (typeof id === 'string') {
            applicationId = parseInt(id);
        } else if (typeof id === 'number') {
            applicationId = id;
        } else {
            return NextResponse.json({ 
                error: "Invalid ID", 
                message: "Application ID must be a valid number" 
            }, { status: 400 });
        }
        
        if (isNaN(applicationId)) {
            return NextResponse.json({ 
                error: "Invalid ID", 
                message: "Application ID must be a valid number" 
            }, { status: 400 });
        }

        console.log('Parsed applicationId:', applicationId);
        console.log('User ID:', decoded.id);

        // Fetch application with internship and company details - Updated with new fields
        const applications = await db
            .select({
                // Application fields
                id: internshipApplications.id,
                userId: internshipApplications.userId,
                internshipId: internshipApplications.internshipId,
                certificateUnlocked: internshipApplications.certificateUnlocked,
                status: internshipApplications.status,
                rollNo: internshipApplications.rollNo,
                examDate: internshipApplications.examDate,
                
                // Internship fields
                internshipId_data: internships.id,
                internshipTitle: internships.title,
                internshipActive: internships.active,
                internshipIsLive: internships.isLive,
                internshipDuration: internships.duration,
                internshipContent: internships.content,
                internshipLastApplyDate: internships.lastApplyDate,
                internshipCreatedAt: internships.createdAt,
                internshipAutoCancel: internships.autoCancel,
                
                // Company fields
                companyName: companies.name,
                companyLogo: companies.logoUrl,
                companyDescription: companies.description,
                companyCategory: companies.category,
                companyVerified: companies.verified,
            })
            .from(internshipApplications)
            .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(eq(internshipApplications.id, applicationId));

        console.log('Query result length:', applications.length);

        // Check if application exists
        if (!applications || applications.length === 0) {
            return NextResponse.json({ 
                error: "Not Found", 
                message: "Application not found" 
            }, { status: 404 });
        }

        const appData = applications[0];

        // Check if the application belongs to the authenticated user
        if (appData.userId !== decoded.id) {
            return NextResponse.json({ 
                error: "Forbidden", 
                message: "You don't have permission to view this application" 
            }, { status: 403 });
        }

        // Determine if internship is active
        const internshipActive = appData.internshipActive && appData.internshipIsLive;

        // Format the response with all new fields
        const formattedApplication = {
            id: appData.id,
            internshipId: appData.internshipId,
            userId: appData.userId,
            certificateUnlocked: appData.certificateUnlocked,
            status: appData.status,
            rollNo: appData.rollNo,
            examDate: appData.examDate,
            internshipActive: internshipActive,
            appliedAt: appData.internshipCreatedAt || new Date().toISOString(),
            internship: {
                id: appData.internshipId_data,
                title: appData.internshipTitle || 'Untitled',
                duration: appData.internshipDuration ? `${appData.internshipDuration} weeks` : 'Not specified',
                description: appData.internshipContent || 'No description provided',
                company: appData.companyName || 'Unknown Company',
                companyLogo: appData.companyLogo,
                location: appData.companyCategory || 'Remote',
                lastApplyDate: appData.internshipLastApplyDate,
                autoCancel: appData.internshipAutoCancel,
                requirements: [],
                companyVerified: appData.companyVerified,
                companyDescription: appData.companyDescription
            }
        };

        return NextResponse.json({ 
            success: true, 
            application: formattedApplication 
        });

    } catch (error) {
        console.error('Error fetching application details:', error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            message: error instanceof Error ? error.message : "Failed to fetch application details" 
        }, { status: 500 });
    }
}