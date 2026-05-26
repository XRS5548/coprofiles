// app/api/manager/companies/[id]/change-member-role/route.ts - Updated with strict permission check
import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const { userId, role, permission } = await request.json();

    // Check if current user has FULL ACCESS permission
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

    // Only Full Access (permission 'f') can change roles
    if (currentUserRole[0].permission !== 'f') {
      return NextResponse.json({ 
        error: "Only users with Full Access permission can change roles" 
      }, { status: 403 });
    }

    // Get the target user's current role
    const targetUserRole = await db
      .select()
      .from(roles)
      .where(and(
        eq(roles.userId, userId),
        eq(roles.companyId, companyId)
      ))
      .limit(1);

    if (!targetUserRole || targetUserRole.length === 0) {
      return NextResponse.json({ error: "User not found in this company" }, { status: 404 });
    }

    // Cannot change Founder's role if you are not Founder
    if (targetUserRole[0].role === 'Founder' && currentUserRole[0].role !== 'Founder') {
      return NextResponse.json({ 
        error: "Only Founder can change another Founder's role" 
      }, { status: 403 });
    }

    // Cannot assign Founder role if you are not Founder
    if (role === 'Founder' && currentUserRole[0].role !== 'Founder') {
      return NextResponse.json({ 
        error: "Only Founder can assign Founder role" 
      }, { status: 403 });
    }

    // Cannot assign higher permission than your own
    const permissionLevel = { 'v': 1, 'c': 2, 'f': 3 };
    if (permissionLevel[permission as keyof typeof permissionLevel] > 
        permissionLevel[currentUserRole[0].permission as keyof typeof permissionLevel]) {
      return NextResponse.json({ 
        error: "You cannot assign higher permission than your own" 
      }, { status: 403 });
    }

    // Update role
    const [updatedRole] = await db
      .update(roles)
      .set({ role, permission })
      .where(and(
        eq(roles.userId, userId),
        eq(roles.companyId, companyId)
      ))
      .returning();

    // Make sure user has manager role type
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
      message: "Role updated successfully",
      member: updatedRole,
    });
  } catch (error) {
    console.error("Error changing role:", error);
    return NextResponse.json({ error: "Failed to change role" }, { status: 500 });
  }
}