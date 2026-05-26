// app/api/manager/companies/[id]/remove-member/route.ts - Updated with strict permission check
import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(
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

    const { userId } = await request.json();

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

    // Only Full Access (permission 'f') can remove members
    if (currentUserRole[0].permission !== 'f') {
      return NextResponse.json({ 
        error: "Only users with Full Access permission can remove team members" 
      }, { status: 403 });
    }

    // Cannot remove yourself
    if (userId === decoded.id) {
      return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
    }

    // Get the target user's role
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

    // Cannot remove Founder if you are not Founder
    if (targetUserRole[0].role === 'Founder' && currentUserRole[0].role !== 'Founder') {
      return NextResponse.json({ 
        error: "Only Founder can remove another Founder" 
      }, { status: 403 });
    }

    // Remove the role
    await db
      .delete(roles)
      .where(and(
        eq(roles.userId, userId),
        eq(roles.companyId, companyId)
      ));

    // Check if user has any other roles in any company
    const remainingRoles = await db
      .select()
      .from(roles)
      .where(eq(roles.userId, userId));

    // If user has no roles left, change role_type back to 'user'
    if (remainingRoles.length === 0) {
      await db
        .update(users)
        .set({ roleType: 'user' })
        .where(eq(users.id, userId));
    }

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}