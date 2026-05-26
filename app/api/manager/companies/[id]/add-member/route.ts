// app/api/manager/companies/[id]/add-member/route.ts - Updated with strict permission check
import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const companyId = parseInt(resolvedParams.id);

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

    // Check if current user has FULL ACCESS permission (only 'f' permission can add members)
    const currentUserRole = await db
      .select()
      .from(roles)
      .where(and(
        eq(roles.userId, decoded.id),
        eq(roles.companyId, companyId)
      ))
      .limit(1);

    if (!currentUserRole || currentUserRole.length === 0) {
      return NextResponse.json({ error: "You don't have access to this company" }, { status: 403 });
    }

    // Only Full Access (permission 'f') can add members
    if (currentUserRole[0].permission !== 'f') {
      return NextResponse.json({ 
        error: "Only users with Full Access permission can add team members" 
      }, { status: 403 });
    }

    const { userId, role, permission } = await request.json();

    // Validate permission - only Founder role can assign Founder role
    if (role === 'Founder' && currentUserRole[0].role !== 'Founder') {
      return NextResponse.json({ 
        error: "Only Founder can assign Founder role" 
      }, { status: 403 });
    }

    // Validate permission - can't assign higher permission than own
    const permissionLevel = { 'v': 1, 'c': 2, 'f': 3 };
    if (permissionLevel[permission as keyof typeof permissionLevel] > 
        permissionLevel[currentUserRole[0].permission as keyof typeof permissionLevel]) {
      return NextResponse.json({ 
        error: "You cannot assign higher permission than your own" 
      }, { status: 403 });
    }

    // Check if user already has a role in this company
    const existingRole = await db
      .select()
      .from(roles)
      .where(and(
        eq(roles.userId, userId),
        eq(roles.companyId, companyId)
      ))
      .limit(1);

    if (existingRole && existingRole.length > 0) {
      return NextResponse.json({ error: "User already has a role in this company" }, { status: 400 });
    }

    // Add new role
    const [newRole] = await db
      .insert(roles)
      .values({
        userId,
        companyId,
        role,
        permission,
      })
      .returning();

    // Update user's role_type to 'manager'
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user && user.length > 0 && user[0].roleType !== 'manager') {
      await db
        .update(users)
        .set({ roleType: 'manager' })
        .where(eq(users.id, userId));
    }

    return NextResponse.json({
      success: true,
      message: "Member added successfully",
      member: newRole,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}