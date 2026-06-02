// app/api/manager/forms/[id]/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions, formPayments, users } from "@/db/schema";
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

    // Get submissions with payment info and user data
    const submissions = await db
      .select({
        submission: formSubmissions,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(formSubmissions)
      .leftJoin(users, eq(formSubmissions.userId, users.id))
      .where(eq(formSubmissions.formId, formId))
      .orderBy(desc(formSubmissions.createdAt));

    const extractFromResponse = (data: Record<string, any> | null, type: "name" | "email") => {
      if (!data || typeof data !== "object") return null;
      const nameKeys = ["name", "fullName", "full_name", "fullname", "firstName", "first_name", "username", "userName"];
      const emailKeys = ["email", "e-mail", "emailAddress", "email_address", "userEmail", "user_email"];
      const keys = type === "name" ? nameKeys : emailKeys;
      for (const key of keys) {
        const val = data[key] || data[key.toLowerCase()];
        if (val && typeof val === "string" && val.trim()) return val.trim();
      }
      return null;
    };

    const submissionsWithPayments = await Promise.all(
      submissions.map(async ({ submission, user }) => {
        const payment = await db
          .select()
          .from(formPayments)
          .where(eq(formPayments.submissionId, submission.id))
          .limit(1);

        const responseData = submission.responseData as Record<string, any> | null;

        const enriched = {
          ...submission,
          submitterName: submission.submitterName || user?.name || extractFromResponse(responseData, "name") || null,
          submitterEmail: submission.submitterEmail || user?.email || extractFromResponse(responseData, "email") || null,
          paymentStatus: payment[0]?.status || submission.paymentStatus || null,
          paymentAmount: payment[0]?.amount || submission.paymentAmount || null,
          paymentId: payment[0]?.razorpayPaymentId || submission.paymentId || null,
          paymentCurrency: payment[0]?.currency || submission.paymentCurrency || null,
        };

        return enriched;
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
