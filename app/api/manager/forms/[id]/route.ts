// app/api/manager/forms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formFields, formSubmissions, formPayments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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

    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .limit(1);

    if (!form || form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, formId))
      .orderBy(formFields.order);

    return NextResponse.json({
      success: true,
      form: form[0],
      fields,
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const {
      title,
      description,
      formType,
      status,
      passkey,
      requireAuth,
      collectPayment,
      paymentAmount,
      paymentDescription,
      confirmationMessage,
      redirectUrl,
      sendEmailCopy,
      maxSubmissions,
      submissionDeadline,
    } = body;

    const [updatedForm] = await db
      .update(forms)
      .set({
        title,
        description: description || null,
        formType: formType || "public",
        status: status || "draft",
        passkey: passkey || null,
        requireAuth: requireAuth || false,
        collectPayment: collectPayment || false,
        paymentAmount: paymentAmount ? paymentAmount * 100 : null,
        paymentDescription: paymentDescription || null,
        confirmationMessage: confirmationMessage || null,
        redirectUrl: redirectUrl || null,
        sendEmailCopy: sendEmailCopy || false,
        maxSubmissions: maxSubmissions || null,
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .returning();

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Form updated successfully",
      form: updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}



export async function DELETE(
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

    // First verify the form belongs to this user
    const formExists = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .limit(1);

    if (!formExists || formExists.length === 0) {
      return NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
    }

    // Delete in correct order (child records first)
    
    // 1. Delete form payments (child of submissions)
    const submissions = await db
      .select({ id: formSubmissions.id })
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));
    
    for (const submission of submissions) {
      await db
        .delete(formPayments)
        .where(eq(formPayments.submissionId, submission.id));
    }
    
    // 2. Delete form submissions
    await db
      .delete(formSubmissions)
      .where(eq(formSubmissions.formId, formId));
    
    // 3. Delete form fields
    await db
      .delete(formFields)
      .where(eq(formFields.formId, formId));
    
    // 4. Finally delete the form
    await db
      .delete(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)));

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}