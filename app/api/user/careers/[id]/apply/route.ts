// app/api/user/careers/[id]/apply/route.ts
import { db } from "@/db";
import { careers, careerApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Check if user has applied
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
        const careerId = parseInt(id);

        if (isNaN(careerId)) {
            return NextResponse.json({ error: "Invalid career ID" }, { status: 400 });
        }

        const application = await db.select({
            id: careerApplications.id,
            careerId: careerApplications.careerId,
            appliedAt: careerApplications.id
        }).from(careerApplications)
            .where(and(
                eq(careerApplications.userId, user.id),
                eq(careerApplications.careerId, careerId)
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

// POST - Apply for career
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
        const careerId = parseInt(id);

        if (isNaN(careerId)) {
            return NextResponse.json({ error: "Invalid career ID" }, { status: 400 });
        }

        // Check if career exists
        const career = await db.select()
            .from(careers)
            .where(eq(careers.id, careerId))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }

        // Check if already applied
        const existingApplication = await db.select()
            .from(careerApplications)
            .where(and(
                eq(careerApplications.userId, user.id),
                eq(careerApplications.careerId, careerId)
            ))
            .then(res => res[0]);

        if (existingApplication) {
            return NextResponse.json({ error: "Already applied for this position" }, { status: 409 });
        }

        // Apply for career
        const [application] = await db.insert(careerApplications).values({
            userId: user.id,
            careerId: careerId
        }).returning();

        return NextResponse.json({
            message: "Applied successfully",
            application
        }, { status: 201 });

    } catch (error) {
        console.error("Error applying for career:", error);
        return NextResponse.json({ 
            error: "Failed to apply",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}