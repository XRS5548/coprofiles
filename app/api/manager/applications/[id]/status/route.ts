// app/api/manager/applications/[id]/status/route.ts
import { db } from "@/db";
import { internshipApplications, internships, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const applicationId = parseInt(resolvedParams.id);
    
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, examDate, feedback } = body;

    // Update status
    let updateQuery = `
      UPDATE internship_applications 
      SET status = '${status}'
    `;
    
    if (examDate) {
      updateQuery += `, exam_date = '${examDate}'`;
    }
    
    updateQuery += ` WHERE id = ${applicationId}`;
    
    await db.execute(sql.raw(updateQuery));

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}