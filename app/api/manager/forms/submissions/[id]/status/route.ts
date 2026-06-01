import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const allowedStatuses = ["pending", "approved", "rejected", "spam"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const submissionId = Number(id);
    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }

    const { status } = await request.json();
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [submission] = await db
      .select({
        id: formSubmissions.id,
        formId: formSubmissions.formId,
      })
      .from(formSubmissions)
      .where(eq(formSubmissions.id, submissionId))
      .limit(1);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const [form] = await db
      .select({ id: forms.id })
      .from(forms)
      .where(and(eq(forms.id, submission.formId), eq(forms.userId, decoded.id)))
      .limit(1);

    if (!form) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedSubmission] = await db
      .update(formSubmissions)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(formSubmissions.id, submissionId))
      .returning();

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
