// app/api/manager/internships/[id]/route.ts
import { db } from "@/db";
import { internships, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Fetch single internship
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
        const { id } = await params;
        const internshipId = parseInt(id);

        const internship = await db.select()
            .from(internships)
            .where(eq(internships.id, internshipId))
            .then(res => res[0]);

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }

        // Check if user has permission to view (optional)
        if (user.roleType === "manager") {
            const userRole = await db.select()
                .from(roles)
                .where(and(
                    eq(roles.userId, user.id),
                    eq(roles.companyId, internship.companyId)
                ))
                .then(res => res[0]);
            
            if (!userRole) {
                return NextResponse.json({ error: "You don't have permission to view this internship" }, { status: 403 });
            }
        }

        return NextResponse.json({ internship });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch internship" }, { status: 500 });
    }
}

// PUT - Update internship
export async function PUT(
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
            return NextResponse.json({ error: "Only managers can update internships" }, { status: 403 });
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
            return NextResponse.json({ error: "You don't have permission to update this internship" }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, lastApplyDate, duration, autoCancel, isLive, active } = body;

        const updatedInternship = await db.update(internships)
            .set({
                title: title || undefined,
                content: content || undefined,
                lastApplyDate: lastApplyDate ? new Date(lastApplyDate) : undefined,
                duration: duration !== undefined ? duration : undefined,
                autoCancel: autoCancel !== undefined ? autoCancel : undefined,
                isLive: isLive !== undefined ? isLive : undefined,
                active: active !== undefined ? active : undefined
            })
            .where(eq(internships.id, internshipId))
            .returning();

        return NextResponse.json({
            message: "Internship updated successfully",
            internship: updatedInternship[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update internship" }, { status: 500 });
    }
}

// DELETE - Delete internship
export async function DELETE(
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
            return NextResponse.json({ error: "Only managers can delete internships" }, { status: 403 });
        }

        // Get internship details
        const internship = await db.select()
            .from(internships)
            .where(eq(internships.id, internshipId))
            .then(res => res[0]);

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }

        // Check permission (only full access can delete)
        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, internship.companyId)
            ))
            .then(res => res[0]);

        if (!userRole || userRole.permission !== "f") {
            return NextResponse.json({ error: "You don't have permission to delete this internship" }, { status: 403 });
        }

        // Delete internship (applications will be handled by cascade)
        await db.delete(internships).where(eq(internships.id, internshipId));

        return NextResponse.json({
            message: "Internship deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete internship" }, { status: 500 });
    }
}