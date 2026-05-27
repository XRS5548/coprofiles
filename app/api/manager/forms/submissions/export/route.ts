// app/api/manager/forms/submissions/export/route.ts - Fixed
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { formSubmissions, forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

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

    const searchParams = request.nextUrl.searchParams;
    const formId = parseInt(searchParams.get("formId") || "0");
    const format = searchParams.get("format") || "csv";

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

    // Get all submissions
    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId))
      .orderBy(formSubmissions.createdAt);

    // Prepare export data with proper type handling
    const exportData: any[] = submissions.map(sub => {
      const createdAt = sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A';
      
      return {
        'Submission ID': sub.id,
        'Submitted At': createdAt,
        'Name': sub.submitterName || '',
        'Email': sub.submitterEmail || '',
        'Phone': sub.submitterPhone || '',
        'Status': sub.status || 'pending',
        ...(sub.responseData as Record<string, any> || {}),
      };
    });

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: exportData,
      });
    }

    if (exportData.length === 0) {
      return new NextResponse('No data available', {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${form[0].title}_submissions.csv"`,
        },
      });
    }

    // Convert to CSV with safe header handling
    const headers = Object.keys(exportData[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of exportData) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle various value types
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes if contains comma
          const escaped = value.replace(/"/g, '""');
          return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped;
        }
        if (typeof value === 'object') {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        return String(value);
      });
      csvRows.push(values.join(','));
    }
    
    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${form[0].title}_submissions.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting submissions:", error);
    return NextResponse.json({ error: "Failed to export submissions" }, { status: 500 });
  }
}