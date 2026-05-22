// app/api/manager/careers/[id]/route.ts
import { db } from "@/db";
import { careers, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Fetch single career
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

        const career = await db.select()
            .from(careers)
            .where(eq(careers.id, careerId))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }

        // Check if user has permission to view (optional - based on your requirements)
        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, career.companyId)
            ))
            .then(res => res[0]);

        if (!userRole) {
            return NextResponse.json({ error: "You don't have permission to view this career" }, { status: 403 });
        }

        return NextResponse.json({ career });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch career" }, { status: 500 });
    }
}

// PUT - Update career
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
        const careerId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can update careers" }, { status: 403 });
        }

        const career = await db.select().from(careers)
            .where(eq(careers.id, careerId))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }

        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, career.companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission to update this career" }, { status: 403 });
        }

        const body = await request.json();
        const { name, position, content, salary, tierScore, tierListId } = body;

        const updatedCareer = await db.update(careers)
            .set({
                name: name || undefined,
                position: position !== undefined ? position : undefined,
                content: content !== undefined ? content : undefined,
                salary: salary !== undefined ? salary : undefined,
                tierScore: tierScore !== undefined ? tierScore : undefined,
                tierListId: tierListId !== undefined ? tierListId : undefined
            })
            .where(eq(careers.id, careerId))
            .returning();

        return NextResponse.json({
            message: "Career updated successfully",
            career: updatedCareer[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update career" }, { status: 500 });
    }
}

// DELETE - Delete career
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
        const careerId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can delete careers" }, { status: 403 });
        }

        const career = await db.select().from(careers)
            .where(eq(careers.id, careerId))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }

        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, career.companyId)
            ))
            .then(res => res[0]);

        if (!userRole || userRole.permission !== "f") {
            return NextResponse.json({ error: "You don't have permission to delete this career" }, { status: 403 });
        }

        await db.delete(careers).where(eq(careers.id, careerId));

        return NextResponse.json({
            message: "Career deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete career" }, { status: 500 });
    }
}