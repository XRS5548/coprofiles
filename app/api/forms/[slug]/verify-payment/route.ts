// app/api/forms/[slug]/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions, formPayments, formFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      formData, 
      userEmail, 
      userName 
    } = body;

    console.log("Verifying payment for slug:", slug);
    console.log("Payment data:", { razorpay_order_id, razorpay_payment_id });

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

    // Verify payment signature
    const body_str = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body_str.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error("Invalid payment signature");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Get payment record
    const paymentResult = await db
      .select()
      .from(formPayments)
      .where(eq(formPayments.razorpayOrderId, razorpay_order_id))
      .limit(1);

    if (!paymentResult || paymentResult.length === 0) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const payment = paymentResult[0];

    // Update payment status
    await db
      .update(formPayments)
      .set({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(formPayments.razorpayOrderId, razorpay_order_id));

    // Update submission with payment info
    await db
      .update(formSubmissions)
      .set({
        paymentId: razorpay_payment_id,
        paymentStatus: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(formSubmissions.id, payment.submissionId));

    // Get fields for email template
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.id));

    // Generate HTML for email
    const generateResponseHtml = (isForUser: boolean) => {
      const title = isForUser ? `Your Payment Confirmation for ${form.title}` : `New Paid Submission: ${form.title}`;
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
            .payment-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px; }
            .payment-amount { font-size: 32px; font-weight: bold; color: #10b981; margin: 10px 0; }
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
              <div class="payment-box">
                <p>✅ Payment Successful</p>
                <div class="payment-amount">₹${(form.paymentAmount || 0) / 100}</div>
                <p>Transaction ID: ${razorpay_payment_id}</p>
              </div>
              <h3>Submission Details:</h3>
              ${Object.entries(formData).map(([key, value]) => {
                const field = fields.find(f => f.fieldName === key);
                return `
                  <div class="field">
                    <div class="field-label">${field?.fieldLabel || key}:</div>
                    <div class="field-value">${value || '-'}</div>
                  </div>
                `;
              }).join('')}
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="btn">Visit Coprofiles</a>
              </div>
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

    // Send confirmation email to user
    const submitterEmail = userEmail || formData.email;
    if (submitterEmail) {
      await sendEmail({
        to: submitterEmail,
        subject: `Payment Confirmation: ${form.title}`,
        html: generateResponseHtml(true),
      });
    }

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Paid Submission: ${form.title} - ₹${(form.paymentAmount || 0) / 100}`,
        html: generateResponseHtml(false),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and form submitted successfully",
      submissionId: payment.submissionId,
      redirectUrl: form.redirectUrl,
      confirmationMessage: form.confirmationMessage,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}