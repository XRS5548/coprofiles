// app/api/user/careers/applications/route.ts - Fixed where clause
import { db } from "@/db";
import { careerApplications, careers, companies } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

        const applications = await db.select({
            // Application fields (only those that exist in schema)
            id: careerApplications.id,
            careerId: careerApplications.careerId,
            userId: careerApplications.userId,
            status: careerApplications.status,
            officeId: careerApplications.officeId,
            appliedDate: careerApplications.appliedDate,
            
            // Career fields
            careerName: careers.name,
            position: careers.position,
            salary: careers.salary,
            careerContent: careers.content,
            tierScore: careers.tierScore,
            
            // Company fields
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            companyDescription: companies.description,
            companyCategory: companies.category,
            companyVerified: companies.verified,
        })
        .from(careerApplications)
        .innerJoin(careers, eq(careerApplications.careerId, careers.id))
        .innerJoin(companies, eq(careers.companyId, companies.id))
        .where(eq(careerApplications.userId, decoded.id))
        .orderBy(desc(careerApplications.id));

        // Transform the response to match frontend expectations
        const transformedApplications = applications.map(app => ({
            id: app.id,
            careerId: app.careerId,
            careerName: app.careerName,
            position: app.position,
            salary: app.salary,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            status: app.status || 'pending',
            officeId: app.officeId,
            appliedAt: app.appliedDate ? new Date(app.appliedDate).getTime() : Date.now(),
            interviewDate: null,
            joiningDate: null,
            feedback: null,
            offerLetterUrl: null,
            salaryOffered: null,
            coverLetter: null,
            resumeUrl: null,
            careerContent: app.careerContent,
            tierScore: app.tierScore,
            companyDescription: app.companyDescription,
            companyCategory: app.companyCategory,
            companyVerified: app.companyVerified,
        }));

        return NextResponse.json({ 
            success: true, 
            applications: transformedApplications,
            count: transformedApplications.length 
        });

    } catch (error) {
        console.error('Error fetching career applications:', error);
        return NextResponse.json({ 
            error: "Failed to fetch applications",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// POST endpoint for creating a new application
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };
        
        const body = await request.json();
        const { careerId, officeId } = body;

        if (!careerId) {
            return NextResponse.json({ 
                error: "Bad Request", 
                message: "Career ID is required" 
            }, { status: 400 });
        }

        // Check if already applied - FIXED: Use and() to combine conditions
        const existingApplication = await db
            .select()
            .from(careerApplications)
            .where(
                and(
                    eq(careerApplications.careerId, careerId),
                    eq(careerApplications.userId, decoded.id)
                )
            );

        if (existingApplication && existingApplication.length > 0) {
            return NextResponse.json({ 
                error: "Already Applied", 
                message: "You have already applied for this position" 
            }, { status: 400 });
        }

        // Create new application
        const [newApplication] = await db
            .insert(careerApplications)
            .values({
                careerId: careerId,
                userId: decoded.id,
                status: 'pending',
                officeId: officeId || null,
                appliedDate: new Date(),
            })
            .returning();

        return NextResponse.json({ 
            success: true, 
            message: "Application submitted successfully",
            application: newApplication
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating career application:', error);
        return NextResponse.json({ 
            error: "Failed to submit application",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// PATCH endpoint for updating application status (for managers/admins)
export async function PATCH(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };
        
        // Check if user has manager role
        if (decoded.roleType !== 'manager') {
            return NextResponse.json({ 
                error: "Forbidden", 
                message: "Only managers can update application status" 
            }, { status: 403 });
        }

        const body = await request.json();
        const { applicationId, status, officeId } = body;

        if (!applicationId) {
            return NextResponse.json({ 
                error: "Bad Request", 
                message: "Application ID is required" 
            }, { status: 400 });
        }

        // Build update data (only fields that exist in schema)
        const updateData: any = {};
        if (status) updateData.status = status;
        if (officeId !== undefined) updateData.officeId = officeId;

        // Update application
        const [updatedApplication] = await db
            .update(careerApplications)
            .set(updateData)
            .where(eq(careerApplications.id, applicationId))
            .returning();

        return NextResponse.json({ 
            success: true, 
            message: "Application updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        console.error('Error updating career application:', error);
        return NextResponse.json({ 
            error: "Failed to update application",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}