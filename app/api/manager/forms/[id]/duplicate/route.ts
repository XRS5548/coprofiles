// app/api/manager/forms/[id]/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formFields } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { slugify } from "@/lib/utils";

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
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    // Get original form
    const originalForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .limit(1);

    if (!originalForm || originalForm.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Generate new slug
    let slug = slugify(`${originalForm[0].title} copy`);
    let counter = 1;
    let existingForm = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
    while (existingForm.length > 0) {
      slug = `${slugify(originalForm[0].title)}-copy-${counter}`;
      existingForm = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
      counter++;
    }

    // Create duplicate form
    const [duplicateForm] = await db
      .insert(forms)
      .values({
        userId: decoded.id,
        title: `${originalForm[0].title} (Copy)`,
        description: originalForm[0].description,
        slug,
        formType: originalForm[0].formType,
        status: "draft",
        passkey: originalForm[0].passkey,
        requireAuth: originalForm[0].requireAuth,
        collectPayment: originalForm[0].collectPayment,
        paymentAmount: originalForm[0].paymentAmount,
        paymentDescription: originalForm[0].paymentDescription,
        confirmationMessage: originalForm[0].confirmationMessage,
        redirectUrl: originalForm[0].redirectUrl,
        sendEmailCopy: originalForm[0].sendEmailCopy,
        maxSubmissions: originalForm[0].maxSubmissions,
        submissionDeadline: originalForm[0].submissionDeadline,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Get original fields
    const originalFields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, formId));

    // Duplicate fields
    for (const field of originalFields) {
      await db.insert(formFields).values({
        formId: duplicateForm.id,
        fieldLabel: field.fieldLabel,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        placeholder: field.placeholder,
        helpText: field.helpText,
        isRequired: field.isRequired,
        order: field.order,
        options: field.options,
        validation: field.validation,
        conditionalLogic: field.conditionalLogic,
        appearance: field.appearance,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form duplicated successfully",
      form: duplicateForm,
    });
  } catch (error) {
    console.error("Error duplicating form:", error);
    return NextResponse.json({ error: "Failed to duplicate form" }, { status: 500 });
  }
}