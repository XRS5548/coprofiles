// app/api/manager/internships/[id]/applications/route.ts
import { db } from "@/db";
import { internships, internshipApplications, users, roles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        
        // Await params - Next.js 15+ requirement
        const { id } = await params;
        const internshipId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can view applications" }, { status: 403 });
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
            return NextResponse.json({ error: "You don't have permission to view applications" }, { status: 403 });
        }

        // Get all applications with user details
        const applications = await db.select({
            id: internshipApplications.id,
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            userPhone: users.phoneNo,
            userProfileImg: users.profileImgUrl,
            certificateUnlocked: internshipApplications.certificateUnlocked,
            appliedAt: internshipApplications.id
        }).from(internshipApplications)
            .innerJoin(users, eq(internshipApplications.userId, users.id))
            .where(eq(internshipApplications.internshipId, internshipId));

        return NextResponse.json({
            internship: {
                id: internship.id,
                title: internship.title,
                companyId: internship.companyId
            },
            totalApplications: applications.length,
            applications
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}

// POST - Add application (Admin/Manager adding on behalf of user)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        const { id } = await params;
        const internshipId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can add applications" }, { status: 403 });
        }

        const internship = await db.select()
            .from(internships)
            .where(eq(internships.id, internshipId))
            .then(res => res[0]);

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }

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

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Check if already applied
        const existingApplication = await db.select()
            .from(internshipApplications)
            .where(and(
                eq(internshipApplications.userId, userId),
                eq(internshipApplications.internshipId, internshipId)
            ))
            .then(res => res[0]);

        if (existingApplication) {
            return NextResponse.json({ error: "User already applied for this internship" }, { status: 409 });
        }

        // Add application
        const [application] = await db.insert(internshipApplications).values({
            userId,
            internshipId,
            certificateUnlocked: false
        }).returning();

        return NextResponse.json({
            message: "Application added successfully",
            application
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add application" }, { status: 500 });
    }
}