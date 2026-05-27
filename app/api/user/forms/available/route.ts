// app/api/user/forms/available/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    let userId: number | null = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        userId = decoded.id;
      } catch (error) {
        // User not logged in, continue with null userId
      }
    }

    // Get all active forms that are available
    let query = db
      .select()
      .from(forms)
      .where(
        and(
          eq(forms.status, 'active'),
          sql`${forms.submissionDeadline} IS NULL OR ${forms.submissionDeadline} > NOW()`
        )
      )
      .orderBy(forms.createdAt);

    const allForms = await query;

    // Get submission counts for each form
    const formsWithStats = await Promise.all(
      allForms.map(async (form) => {
        let submissionCount = 0;
        
        // Count all submissions for this form
        const submissions = await db
          .select()
          .from(formSubmissions)
          .where(eq(formSubmissions.formId, form.id));
        
        submissionCount = submissions.length;
        
        // If form requires authentication and user is not logged in, exclude it
        if (form.formType === 'authenticated' && !userId) {
          return null;
        }
        
        // If form is private, exclude from public listing
        if (form.formType === 'private') {
          return null;
        }
        
        return {
          ...form,
          submissionCount,
          isAvailable: true,
        };
      })
    );

    const availableForms = formsWithStats.filter(form => form !== null);

    return NextResponse.json({
      success: true,
      forms: availableForms,
      total: availableForms.length,
    });
  } catch (error) {
    console.error("Error fetching available forms:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}