// app/api/forms/[slug]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const body = await request.json();
    const { formData } = body;

    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (!form || form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if form is active
    if (form[0].status !== 'active') {
      return NextResponse.json({ error: "Form is not accepting submissions" }, { status: 400 });
    }

    // Check max submissions
    const existingSubmissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, form[0].id));

    if (form[0].maxSubmissions && existingSubmissions.length >= form[0].maxSubmissions) {
      return NextResponse.json({ error: "Maximum submissions reached" }, { status: 400 });
    }

    // Create submission
    const [submission] = await db
      .insert(formSubmissions)
      .values({
        formId: form[0].id,
        responseData: formData,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}