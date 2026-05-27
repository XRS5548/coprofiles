// app/api/manager/forms/[id]/submissions/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { formSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formId = parseInt(resolvedParams.id);
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    return NextResponse.json({
      success: true,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Error fetching submission count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}