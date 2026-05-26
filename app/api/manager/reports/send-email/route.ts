// app/api/manager/reports/send-email/route.ts
import { db } from "@/db";
import { internships, internshipApplications, certificates, companies, roles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

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

    const { companyId, email, reportType, dateRange } = await request.json();

    // Get company details
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    const companyName = company[0]?.name || 'Your Company';

    // Get report data
    const internshipsList = await db
      .select()
      .from(internships)
      .where(eq(internships.companyId, companyId));

    const applications = await db
      .select()
      .from(internshipApplications)
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .where(eq(internships.companyId, companyId));

    const certificatesList = await db
      .select()
      .from(certificates)
      .innerJoin(internshipApplications, eq(certificates.internshipApplicationId, internshipApplications.id))
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .where(eq(internships.companyId, companyId));

    const stats = {
      totalInternships: internshipsList.length,
      activeInternships: internshipsList.filter(i => i.active && i.isLive).length,
      draftInternships: internshipsList.filter(i => i.active && !i.isLive).length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.internship_applications.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.internship_applications.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.internship_applications.status === 'rejected').length,
      completedInternships: applications.filter(a => a.internship_applications.status === 'completed').length,
      certificatesIssued: certificatesList.length,
      certificatesPaid: certificatesList.filter(c => c.certificates.status === 'active').length,
      totalRevenue: certificatesList.filter(c => c.certificates.status === 'active').length * 129,
    };

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate beautiful HTML email
    const htmlContent = generateReportEmail({
      companyName,
      stats,
      reportType,
      dateRange,
      generatedAt: new Date(),
    });

    // Send email
    await transporter.sendMail({
      from: `"Coprofiles Reports" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: 'report@sqrock.cloud',
      subject: `📊 ${companyName} - ${reportType.toUpperCase()} Report | ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `report-${companyName.toLowerCase().replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
          content: generatePDFReport(stats, companyName, reportType, dateRange),
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: `Report sent successfully to ${email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

// Function to generate beautiful HTML email
function generateReportEmail(data: {
  companyName: string;
  stats: any;
  reportType: string;
  dateRange: string;
  generatedAt: Date;
}): string {
  const { companyName, stats, reportType, dateRange, generatedAt } = data;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getDateRangeText = (range: string) => {
    switch (range) {
      case 'this_month': return 'This Month';
      case 'last_month': return 'Last Month';
      case 'this_quarter': return 'This Quarter';
      case 'this_year': return 'This Year';
      default: return 'All Time';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${companyName} - Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          margin-bottom: 25px;
        }
        .greeting h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 25px 0;
        }
        .stat-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #4f46e5;
          margin: 5px 0;
        }
        .stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section {
          margin: 25px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 10px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1e293b;
          border-left: 3px solid #4f46e5;
          padding-left: 10px;
        }
        .progress-bar {
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin: 8px 0;
        }
        .progress-fill {
          background: #4f46e5;
          height: 8px;
          border-radius: 10px;
        }
        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 5px;
        }
        .footer {
          background: #f8fafc;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
        }
        .btn {
          display: inline-block;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 8px;
          margin-top: 15px;
        }
        .badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .revenue {
          font-size: 32px;
          font-weight: 700;
          color: #10b981;
          text-align: center;
          margin: 10px 0;
        }
        hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 ${reportType.toUpperCase()} Report</h1>
          <p>${companyName}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            <h2>Hello, ${companyName} Team! 👋</h2>
            <p>Here's your ${getDateRangeText(dateRange)} performance report.</p>
            <p><span class="badge">Generated: ${generatedAt.toLocaleString()}</span></p>
          </div>

          <!-- Key Metrics -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.totalInternships}</div>
              <div class="stat-label">Total Internships</div>
              <small style="color: #10b981;">${stats.activeInternships} active</small>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalApplications}</div>
              <div class="stat-label">Applications</div>
              <small style="color: #eab308;">${stats.pendingApplications} pending</small>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.certificatesIssued}</div>
              <div class="stat-label">Certificates</div>
              <small style="color: #10b981;">${stats.certificatesPaid} paid</small>
            </div>
            <div class="stat-card">
              <div class="stat-value revenue">${formatCurrency(stats.totalRevenue)}</div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>

          <!-- Application Status -->
          <div class="section">
            <div class="section-title">📋 Application Status</div>
            <div>
              <div class="progress-label">
                <span>Pending</span>
                <span>${stats.pendingApplications} (${Math.round((stats.pendingApplications / stats.totalApplications) * 100)}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(stats.pendingApplications / stats.totalApplications) * 100}%; background: #eab308;"></div>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div class="progress-label">
                <span>Accepted</span>
                <span>${stats.acceptedApplications} (${Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(stats.acceptedApplications / stats.totalApplications) * 100}%; background: #10b981;"></div>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div class="progress-label">
                <span>Rejected</span>
                <span>${stats.rejectedApplications} (${Math.round((stats.rejectedApplications / stats.totalApplications) * 100)}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(stats.rejectedApplications / stats.totalApplications) * 100}%; background: #ef4444;"></div>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div class="progress-label">
                <span>Completed</span>
                <span>${stats.completedInternships}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(stats.completedInternships / stats.totalInternships) * 100}%; background: #8b5cf6;"></div>
              </div>
            </div>
          </div>

          <!-- Certificate Revenue -->
          <div class="section">
            <div class="section-title">💰 Certificate Revenue Breakdown</div>
            <div class="progress-label">
              <span>Certificates Issued</span>
              <span>${stats.certificatesIssued}</span>
            </div>
            <div class="progress-label">
              <span>Paid Certificates</span>
              <span>${stats.certificatesPaid}</span>
            </div>
            <div class="progress-label">
              <span>Pending Payment</span>
              <span>${stats.certificatesIssued - stats.certificatesPaid}</span>
            </div>
            <hr>
            <div class="progress-label" style="font-weight: 600;">
              <span>Total Revenue from Certificates</span>
              <span style="color: #10b981; font-size: 18px;">${formatCurrency(stats.totalRevenue)}</span>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/manager/reports" class="btn">📈 View Full Dashboard</a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated report from Coprofiles.</p>
          <p>© ${new Date().getFullYear()} Coprofiles. All rights reserved.</p>
          <p style="margin-top: 10px; font-size: 11px;">
            If you didn't request this report, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to generate PDF report (simplified version)
function generatePDFReport(stats: any, companyName: string, reportType: string, dateRange: string): Buffer {
  // You can implement actual PDF generation using libraries like puppeteer or pdfkit
  // For now, returning a placeholder
  return Buffer.from('PDF content would be here');
}