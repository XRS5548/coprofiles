// app/api/forms/[slug]/submit/route.ts - Fixed for schema
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formFields, formSubmissions, formPayments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const body = await request.json();
    const { formData, userId, userEmail, userName } = body;

    console.log("Form submission received for slug:", slug);

    // Get form
    const formResult = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (!formResult || formResult.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = formResult[0];

    // Check if form is active
    if (form.status !== 'active') {
      return NextResponse.json({ error: "Form is not accepting submissions" }, { status: 400 });
    }

    // Check max submissions
    const existingSubmissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, form.id));

    if (form.maxSubmissions && existingSubmissions.length >= form.maxSubmissions) {
      return NextResponse.json({ error: "Maximum submissions reached" }, { status: 400 });
    }

    // Check deadline
    if (form.submissionDeadline && new Date(form.submissionDeadline) < new Date()) {
      return NextResponse.json({ error: "Submission deadline has passed" }, { status: 400 });
    }

    // Get fields for validation
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.id));

    // Validate required fields
    const missingFields: string[] = [];
    for (const field of fields) {
      if (field.isRequired && (!formData[field.fieldName] || formData[field.fieldName] === '')) {
        missingFields.push(field.fieldLabel);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Required fields missing: ${missingFields.join(', ')}`,
        missingFields,
      }, { status: 400 });
    }

    // Create submission record first
    const [submission] = await db
      .insert(formSubmissions)
      .values({
        formId: form.id,
        userId: userId || null,
        submitterName: userName || formData.name || null,
        submitterEmail: userEmail || formData.email || null,
        submitterPhone: formData.phone || null,
        responseData: formData,
        paymentStatus: 'pending',
        status: "pending",
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        userAgent: request.headers.get('user-agent') || null,
        createdAt: new Date(),
      })
      .returning();

    console.log("Submission created:", submission.id);

    let paymentId = null;
    let paymentAmount = null;

    // Handle payment if enabled
    if (form.collectPayment && form.paymentAmount) {
      try {
        const order = await razorpay.orders.create({
          amount: form.paymentAmount,
          currency: 'INR',
          receipt: `form_${form.id}_${submission.id}`,
          notes: {
            formId: form.id.toString(),
            submissionId: submission.id.toString(),
            formTitle: form.title,
          },
        });

        paymentId = order.id;
        paymentAmount = form.paymentAmount;

        // Create payment record with submissionId
        await db.insert(formPayments).values({
          formId: form.id,
          submissionId: submission.id,
          razorpayOrderId: order.id,
          amount: form.paymentAmount,
          currency: 'INR',
          status: 'pending',
          customerName: userName || formData.name || null,
          customerEmail: userEmail || formData.email || null,
          customerPhone: formData.phone || null,
          metadata: { formData },
        });

        // Update submission with payment info
        await db
          .update(formSubmissions)
          .set({
            paymentId: order.id,
            paymentAmount: form.paymentAmount,
          })
          .where(eq(formSubmissions.id, submission.id));

        return NextResponse.json({
          success: true,
          requiresPayment: true,
          submissionId: submission.id,
          orderId: order.id,
          amount: form.paymentAmount,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      } catch (paymentError) {
        console.error("Payment creation error:", paymentError);
        // Delete the submission if payment fails
        await db.delete(formSubmissions).where(eq(formSubmissions.id, submission.id));
        return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
      }
    }

    // Generate HTML for email
    const generateResponseHtml = (isForUser: boolean) => {
      const title = isForUser ? `Your Submission to ${form.title}` : `New Submission: ${form.title}`;
      const headerColor = isForUser ? '#4f46e5' : '#10b981';
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f7; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: ${headerColor}; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 3px solid ${headerColor}; }
            .field-label { font-weight: 600; margin-bottom: 5px; color: #1e293b; }
            .field-value { color: #475569; word-break: break-word; }
            .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            .btn { display: inline-block; background: ${headerColor}; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
              <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="content">
              <h3 style="margin-top: 0;">Submission Details:</h3>
              ${Object.entries(formData).map(([key, value]) => {
                const field = fields.find(f => f.fieldName === key);
                return `
                  <div class="field">
                    <div class="field-label">${field?.fieldLabel || key}:</div>
                    <div class="field-value">${value || '-'}</div>
                  </div>
                `;
              }).join('')}
              ${isForUser ? `
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="btn">Visit Coprofiles</a>
                </div>
              ` : `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/manager/forms/${form.id}/submissions" class="btn">View in Dashboard</a>
                </div>
              `}
            </div>
            <div class="footer">
              <p>This is an automated message from Coprofiles. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Coprofiles. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    // Send email to submitter (if enabled and email exists)
    const submitterEmail = userEmail || formData.email;
    if (form.sendEmailCopy && submitterEmail) {
      await sendEmail({
        to: submitterEmail,
        subject: `Thank you for submitting ${form.title}`,
        html: generateResponseHtml(true),
      });
    }

    // Send notification to form owner
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Form Submission: ${form.title}`,
        html: generateResponseHtml(false),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission.id,
      redirectUrl: form.redirectUrl,
      confirmationMessage: form.confirmationMessage,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}