// app/api/manager/internships/[id]/applications/[applicationId]/certificate/route.ts
import { db } from "@/db";
import { internships, internshipApplications, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; applicationId: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        
        // Await params - Next.js 15+ requirement
        const { id, applicationId } = await params;
        const internshipId = parseInt(id);
        const appId = parseInt(applicationId);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can unlock certificates" }, { status: 403 });
        }

        // Get internship details
        const internship = await db.select()
            .from(internships)
            .where(eq(internships.id, internshipId))
            .then(res => res[0]);

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }

        // Check permission
        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, internship.companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission" }, { status: 403 });
        }

        // Update certificate
        const updated = await db.update(internshipApplications)
            .set({ certificateUnlocked: true })
            .where(and(
                eq(internshipApplications.id, appId),
                eq(internshipApplications.internshipId, internshipId)
            ))
            .returning();

        if (updated.length === 0) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Certificate unlocked successfully",
            application: updated[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to unlock certificate" }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; applicationId: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        const { id, applicationId } = await params;
        const internshipId = parseInt(id);
        const appId = parseInt(applicationId);

        // Get application
        const application = await db.select({
            id: internshipApplications.id,
            certificateUnlocked: internshipApplications.certificateUnlocked,
            userId: internshipApplications.userId,
            internshipId: internshipApplications.internshipId
        }).from(internshipApplications)
            .where(and(
                eq(internshipApplications.id, appId),
                eq(internshipApplications.internshipId, internshipId)
            ))
            .then(res => res[0]);

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Check if user has permission (either manager or the applicant)
        const isApplicant = application.userId === user.id;
        const isManager = user.roleType === "manager";

        if (!isApplicant && !isManager) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({
            certificateUnlocked: application.certificateUnlocked,
            applicationId: application.id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch certificate status" }, { status: 500 });
    }
}