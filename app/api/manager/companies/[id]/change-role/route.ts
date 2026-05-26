// app/api/manager/companies/[id]/change-role/route.ts - Change user role
import { db } from "@/db";
import { roles } from "@/db/schema";
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    
    const body = await request.json();
    const { role } = body;

    // Update user's role for this company
    const [updatedRole] = await db
      .update(roles)
      .set({ role })
      .where(and(
        eq(roles.userId, decoded.id),
        eq(roles.companyId, companyId)
      ))
      .returning();

    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error changing role:", error);
    return NextResponse.json({ error: "Failed to change role" }, { status: 500 });
  }
}