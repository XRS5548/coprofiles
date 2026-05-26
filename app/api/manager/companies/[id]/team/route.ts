// app/api/manager/companies/[id]/team/route.ts
import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
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

    // Check if user has access to this company
    const userRole = await db
      .select()
      .from(roles)
      .where(and(
        eq(roles.userId, decoded.id),
        eq(roles.companyId, companyId)
      ))
      .limit(1);

    if (!userRole || userRole.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all team members
    const members = await db
      .select({
        id: roles.id,
        userId: roles.userId,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phoneNo,
        userProfile: users.profileImgUrl,
        role: roles.role,
        permission: roles.permission,
        joinedAt: users.createdAt,
      })
      .from(roles)
      .innerJoin(users, eq(roles.userId, users.id))
      .where(eq(roles.companyId, companyId))
      .orderBy(roles.role);

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}