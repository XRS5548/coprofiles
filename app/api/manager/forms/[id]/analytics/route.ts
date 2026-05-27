// app/api/manager/forms/[id]/analytics/route.ts - Fixed
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms, formSubmissions, formAnalytics, formPayments } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

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
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "30d";

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
      .where(eq(formSubmissions.formId, formId));

    // Get payments for these submissions
    let payments: any[] = [];
    if (submissions.length > 0) {
      const submissionIds = submissions.map(s => s.id);
      // Use simple loop instead of SQL IN to avoid issues
      payments = [];
      for (const subId of submissionIds) {
        const payment = await db
          .select()
          .from(formPayments)
          .where(eq(formPayments.submissionId, subId))
          .limit(1);
        if (payment && payment.length > 0) {
          payments.push(payment[0]);
        }
      }
    }

    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(s => s.status === 'approved').length;
    const conversionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;

    // Calculate total revenue from completed payments (convert from paise to rupees for display)
    const totalRevenueInPaise = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Store in rupees for display
    const totalRevenueInRupees = totalRevenueInPaise / 100;

    // Get analytics data
    const analyticsData = await db
      .select()
      .from(formAnalytics)
      .where(eq(formAnalytics.formId, formId))
      .orderBy(formAnalytics.date);

    // Get daily stats for last 30 days
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAnalytics = analyticsData.find(a => {
        if (!a.date) return false;
        const aDate = new Date(a.date).toISOString().split('T')[0];
        return aDate === dateStr;
      });
      
      const daySubmissions = submissions.filter(s => {
        if (!s.createdAt) return false;
        const sDate = new Date(s.createdAt).toISOString().split('T')[0];
        return sDate === dateStr;
      });
      
      last30Days.push({
        date: dateStr,
        views: dayAnalytics?.views || 0,
        starts: dayAnalytics?.starts || 0,
        completions: daySubmissions.length,
      });
    }

    // Get device stats (mock data for now)
    const deviceStats = [
      { device: 'Desktop', count: 680, percentage: 54.4 },
      { device: 'Mobile', count: 520, percentage: 41.6 },
      { device: 'Tablet', count: 50, percentage: 4.0 },
    ];

    // Get source stats (mock data for now)
    const sourceStats = [
      { source: 'Direct', count: 450, percentage: 36.0 },
      { source: 'Social', count: 320, percentage: 25.6 },
      { source: 'Referral', count: 280, percentage: 22.4 },
      { source: 'Email', count: 200, percentage: 16.0 },
    ];

    // Get recent activity from submissions
    const recentActivity = submissions
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map(sub => ({
        id: sub.id,
        type: 'submission',
        message: `New submission received${sub.submitterName ? ` from ${sub.submitterName}` : ''}`,
        time: sub.createdAt ? formatRelativeTime(new Date(sub.createdAt)) : 'Recently',
      }));

    // Calculate total views and starts
    const totalViews = analyticsData.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalStarts = analyticsData.reduce((sum, a) => sum + (a.starts || 0), 0);

    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalViews: totalViews,
          totalStarts: totalStarts,
          totalCompletions: completedSubmissions,
          conversionRate: Math.round(conversionRate * 10) / 10,
          totalRevenue: totalRevenueInRupees,
          avgCompletionTime: '2.3 min',
        },
        dailyStats: last30Days,
        deviceStats: deviceStats,
        sourceStats: sourceStats,
        topForms: [],
        recentActivity: recentActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}