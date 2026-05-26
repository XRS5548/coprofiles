// app/api/manager/companies/delete/[id]/route.ts - New endpoint
import { db } from "@/db";
import { companies, roles } from "@/db/schema";
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

    // Check if user is founder
    const userRole = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.userId, decoded.id),
          eq(roles.companyId, companyId),
          eq(roles.role, 'Founder')
        )
      );

    if (!userRole || userRole.length === 0) {
      return NextResponse.json({ error: "Only Founder can delete company" }, { status: 403 });
    }

    // Delete company
    await db.delete(companies).where(eq(companies.id, companyId));

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}