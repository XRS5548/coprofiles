// app/api/manager/forms/[id]/fields/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { formFields } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

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
    const { fields } = await request.json();

    // Delete existing fields
    await db.delete(formFields).where(eq(formFields.formId, formId));

    // Insert new fields
    for (const field of fields) {
      await db.insert(formFields).values({
        formId,
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
      });
    }

    return NextResponse.json({
      success: true,
      message: "Fields updated successfully",
    });
  } catch (error) {
    console.error("Error updating fields:", error);
    return NextResponse.json({ error: "Failed to update fields" }, { status: 500 });
  }
}