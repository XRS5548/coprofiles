// app/api/user/internships/[id]/apply/route.ts
import { db } from "@/db";
import { internships, internshipApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const { id } = await params;
        const internshipId = parseInt(id);

        if (isNaN(internshipId)) {
            return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
        }

        const application = await db.select({
            id: internshipApplications.id,
            internshipId: internshipApplications.internshipId,
            certificateUnlocked: internshipApplications.certificateUnlocked,
        }).from(internshipApplications)
            .where(and(
                eq(internshipApplications.userId, user.id),
                eq(internshipApplications.internshipId, internshipId)
            ))
            .then(res => res[0]);

        return NextResponse.json({
            hasApplied: !!application,
            application: application || null
        });

    } catch (error) {
        console.error("Error checking application:", error);
        return NextResponse.json({ error: "Failed to check application status" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const { id } = await params;
        const internshipId = parseInt(id);

        // Validate internship ID
        if (isNaN(internshipId)) {
            return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
        }

        // Check if internship exists and is active
        const internship = await db.select({
            id: internships.id,
            active: internships.active,
            isLive: internships.isLive,
            title: internships.title,
            lastApplyDate: internships.lastApplyDate
        }).from(internships)
            .where(eq(internships.id, internshipId))
            .then(res => res[0]);

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }

        // Check if internship is accepting applications
        if (!internship.active) {
            return NextResponse.json({ error: "This internship is no longer active" }, { status: 400 });
        }

        if (!internship.isLive) {
            return NextResponse.json({ error: "This internship is not currently accepting applications" }, { status: 400 });
        }

        // Check if last apply date has passed
        if (internship.lastApplyDate && new Date(internship.lastApplyDate) < new Date()) {
            return NextResponse.json({ error: "Application deadline has passed" }, { status: 400 });
        }

        // Check if already applied
        const existingApplication = await db.select()
            .from(internshipApplications)
            .where(and(
                eq(internshipApplications.userId, user.id),
                eq(internshipApplications.internshipId, internshipId)
            ))
            .then(res => res[0]);

        if (existingApplication) {
            return NextResponse.json({ 
                error: "Already applied for this internship",
                applicationId: existingApplication.id
            }, { status: 409 });
        }

        // Apply for internship
        const [application] = await db.insert(internshipApplications).values({
            userId: user.id,
            internshipId: internshipId,
            certificateUnlocked: false
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Successfully applied for internship",
            application: {
                id: application.id,
                internshipId: application.internshipId,
                internshipTitle: internship.title,
                certificateUnlocked: application.certificateUnlocked
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Error applying for internship:", error);
        return NextResponse.json({ 
            error: "Failed to apply for internship",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}