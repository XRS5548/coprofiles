// app/api/manager/users/[id]/roles/route.ts - Check user's all roles
import { db } from "@/db";
import { roles, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = parseInt(resolvedParams.id);

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

    // Get all roles for this user
    const userRoles = await db
      .select({
        id: roles.id,
        companyId: roles.companyId,
        companyName: companies.name,
        role: roles.role,
        permission: roles.permission,
      })
      .from(roles)
      .innerJoin(companies, eq(roles.companyId, companies.id))
      .where(eq(roles.userId, userId));

    return NextResponse.json({
      success: true,
      roles: userRoles,
      totalRoles: userRoles.length,
    });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json({ error: "Failed to fetch user roles" }, { status: 500 });
  }
}