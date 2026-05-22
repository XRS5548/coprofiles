// app/api/manager/company/[id]/members/route.ts
import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Fetch all members
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
        const companyId = parseInt(id);

        // Check if user has access to this company
        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!userRole) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const members = await db.select({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: roles.role,
            permission: roles.permission,
            profileImgUrl: users.profileImgUrl,
        }).from(roles)
            .innerJoin(users, eq(roles.userId, users.id))
            .where(eq(roles.companyId, companyId))
            .orderBy(roles.role);

        return NextResponse.json({ members });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}

// POST - Add member to company (Manager only)
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
        const companyId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can add members" }, { status: 403 });
        }

        // Check if current user has permission
        const currentUserRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!currentUserRole || (currentUserRole.permission !== "f" && currentUserRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission to add members" }, { status: 403 });
        }

        const body = await request.json();
        const { userId, role, permission } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
        }

        // Check if user exists
        const targetUser = await db.select().from(users)
            .where(eq(users.id, userId))
            .then(res => res[0]);

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user is already a member
        const existingRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, userId),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (existingRole) {
            return NextResponse.json({ error: "User is already a member of this company" }, { status: 409 });
        }

        // Add member
        const [newRole] = await db.insert(roles).values({
            userId,
            companyId,
            role,
            permission: permission || "v"
        }).returning();

        return NextResponse.json({
            message: "Member added successfully",
            member: newRole
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
    }
}


// DELETE - Remove member from company
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
        const companyId = parseInt(id);

        const url = new URL(request.url);
        const userId = parseInt(url.searchParams.get("userId") || "0");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can remove members" }, { status: 403 });
        }

        // Check if current user has permission
        const currentUserRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!currentUserRole || currentUserRole.permission !== "f") {
            return NextResponse.json({ error: "You don't have permission to remove members" }, { status: 403 });
        }

        // Cannot remove yourself
        if (user.id === userId) {
            return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
        }

        // Remove member
        await db.delete(roles)
            .where(and(
                eq(roles.userId, userId),
                eq(roles.companyId, companyId)
            ));

        return NextResponse.json({
            message: "Member removed successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}