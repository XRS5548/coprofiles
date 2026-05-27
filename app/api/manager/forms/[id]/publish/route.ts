// app/api/manager/forms/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(
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

    const [updatedForm] = await db
      .update(forms)
      .set({
        status: "active",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .returning();

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Form published successfully",
      form: updatedForm,
    });
  } catch (error) {
    console.error("Error publishing form:", error);
    return NextResponse.json({ error: "Failed to publish form" }, { status: 500 });
  }
}