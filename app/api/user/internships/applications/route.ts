// app/api/user/internships/applications/route.ts
import { db } from "@/db";
import { internshipApplications, internships, companies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
            id: internshipApplications.id,
            internshipId: internships.id,
            internshipTitle: internships.title,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            status: internshipApplications.status,
            rollNo: internshipApplications.rollNo,
            examDate: internshipApplications.examDate,
            certificateUnlocked: internshipApplications.certificateUnlocked,
            internshipActive: internships.active,
            internshipIsLive: internships.isLive,
            lastApplyDate: internships.lastApplyDate,
            duration: internships.duration,
            content: internships.content,
        })
        .from(internshipApplications)
        .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
        .innerJoin(companies, eq(internships.companyId, companies.id))
        .where(eq(internshipApplications.userId, decoded.id))
        .orderBy(desc(internshipApplications.id));

        // Transform the response
        const transformedApplications = applications.map(app => ({
            id: app.id,
            internshipId: app.internshipId,
            internshipTitle: app.internshipTitle,
            companyName: app.companyName,
            companyLogo: app.companyLogo,
            status: app.status,
            rollNo: app.rollNo,
            examDate: app.examDate,
            certificateUnlocked: app.certificateUnlocked,
            internshipActive: app.internshipActive && app.internshipIsLive,
            lastApplyDate: app.lastApplyDate,
            duration: app.duration,
            description: app.content,
        }));

        return NextResponse.json({ 
            success: true, 
            applications: transformedApplications,
            count: transformedApplications.length 
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ 
            error: "Failed to fetch applications",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}