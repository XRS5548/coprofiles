// app/api/manager/forms/route.ts - Fixed with fields creation
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formFields, formSubmissions, formAnalytics } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, decoded.id))
      .orderBy(desc(forms.createdAt));

    // Get submission counts for each form
    const formsWithStats = await Promise.all(
      allForms.map(async (form) => {
        const submissions = await db
          .select()
          .from(formSubmissions)
          .where(eq(formSubmissions.formId, form.id));
        
        const analytics = await db
          .select()
          .from(formAnalytics)
          .where(eq(formAnalytics.formId, form.id));
        
        const totalViews = analytics.reduce((sum, a) => sum + (a.views || 0), 0);
        
        return {
          ...form,
          submissionCount: submissions.length,
          views: totalViews,
        };
      })
    );

    return NextResponse.json({
      success: true,
      forms: formsWithStats,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Create form request body:", body);
    
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
      fields, // Add fields from request
    } = body;

    // Validate title
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(title);
    let counter = 1;
    let existingForm = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
    while (existingForm.length > 0) {
      slug = `${slugify(title)}-${counter}`;
      existingForm = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
      counter++;
    }

    // Create form
    const [newForm] = await db
      .insert(forms)
      .values({
        userId: decoded.id,
        title,
        description: description || null,
        slug,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("Form created:", newForm);

    // Create form fields if provided
    if (fields && Array.isArray(fields) && fields.length > 0) {
      console.log("Creating fields:", fields.length);
      
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        await db.insert(formFields).values({
          formId: newForm.id,
          fieldLabel: field.fieldLabel,
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          placeholder: field.placeholder || null,
          helpText: field.helpText || null,
          isRequired: field.isRequired || false,
          order: i,
          options: field.options || null,
          validation: field.validation || null,
          conditionalLogic: field.conditionalLogic || null,
          appearance: field.appearance || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log("Fields created successfully");
    } else {
      // Create default fields if no fields provided
      console.log("No fields provided, creating default fields");
      await db.insert(formFields).values([
        {
          formId: newForm.id,
          fieldLabel: "Full Name",
          fieldName: "full_name",
          fieldType: "text",
          placeholder: "Enter your full name",
          helpText: null,
          isRequired: true,
          order: 0,
          options: null,
          validation: null,
          conditionalLogic: null,
          appearance: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          formId: newForm.id,
          fieldLabel: "Email Address",
          fieldName: "email",
          fieldType: "email",
          placeholder: "you@example.com",
          helpText: null,
          isRequired: true,
          order: 1,
          options: null,
          validation: null,
          conditionalLogic: null,
          appearance: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Form created successfully",
      form: newForm,
    });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}