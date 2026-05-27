// app/api/forms/[slug]/route.ts - Fixed
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formFields, formSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    console.log("Fetching form with slug:", slug);

    // Get form
    const formResult = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    console.log("Form query result:", formResult);

    if (!formResult || formResult.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = formResult[0];

    // Get fields for this form
    const fieldsResult = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.id))
      .orderBy(formFields.order);

    console.log("Fields query result:", fieldsResult);

    // Get submission count
    const submissionsResult = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, form.id));

    const submissionCount = submissionsResult.length;

    return NextResponse.json({
      success: true,
      form: {
        ...form,
        submissionCount,
      },
      fields: fieldsResult || [],
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
  }
}