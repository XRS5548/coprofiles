// app/api/manager/forms/[id]/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions, formPayments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
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

    // Verify form ownership
    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, decoded.id)))
      .limit(1);

    if (!form || form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get submissions with payment info
    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId))
      .orderBy(desc(formSubmissions.createdAt));

    // Get payment info for each submission
    const submissionsWithPayments = await Promise.all(
      submissions.map(async (submission) => {
        const payment = await db
          .select()
          .from(formPayments)
          .where(eq(formPayments.submissionId, submission.id))
          .limit(1);
        
        return {
          ...submission,
          paymentStatus: payment[0]?.status || null,
          paymentAmount: payment[0]?.amount || null,
          paymentId: payment[0]?.razorpayPaymentId || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      submissions: submissionsWithPayments,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}