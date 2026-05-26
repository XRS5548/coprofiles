// app/api/manager/internships/route.ts - Fixed Drizzle query
import { db } from "@/db";
import { internships, companies, internshipApplications, roles } from "@/db/schema";
import { eq, desc, like, and, sql, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    
    // Check if user is manager
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    let conditions = [];
    if (search) {
      conditions.push(like(internships.title, `%${search}%`));
    }
    
    if (status === 'active') {
      conditions.push(eq(internships.active, true));
    } else if (status === 'inactive') {
      conditions.push(eq(internships.active, false));
    } else if (status === 'live') {
      conditions.push(eq(internships.isLive, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get internships with application counts using a simpler approach
    const allInternships = await db
      .select({
        id: internships.id,
        title: internships.title,
        active: internships.active,
        isLive: internships.isLive,
        lastApplyDate: internships.lastApplyDate,
        duration: internships.duration,
        autoCancel: internships.autoCancel,
        createdAt: internships.createdAt,
        companyId: internships.companyId,
        companyName: companies.name,
        applicationsCount: sql<number>`(
          SELECT COUNT(*) FROM ${internshipApplications} 
          WHERE ${internshipApplications.internshipId} = ${internships.id}
        )`,
      })
      .from(internships)
      .leftJoin(companies, eq(internships.companyId, companies.id))
      .where(whereClause)
      .orderBy(desc(internships.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count using a separate query
    let totalQuery = db.select({ count: sql<number>`COUNT(*)` }).from(internships);
    if (whereClause) {
      totalQuery = totalQuery.where(whereClause) as any;
    }
    const totalResult = await totalQuery;
    const total = Number(totalResult[0]?.count) || 0;

    console.log('Total internships:', total);
    console.log('Returned internships:', allInternships.length);

    return NextResponse.json({
      success: true,
      internships: allInternships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching internships:", error);
    return NextResponse.json(
      { error: "Failed to fetch internships", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}




// POST endpoint for creating internship
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    
    // Check if user is manager
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, companyId, content, duration, lastApplyDate, active, isLive, autoCancel } = body;

    // Validation
    if (!title || !companyId || !content || !duration || !lastApplyDate) {
      return NextResponse.json(
        { error: "Missing required fields", message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // Check if user has permission for this company
    const userRole = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.userId, decoded.id),
          eq(roles.companyId, companyId)
        )
      )
      .limit(1);

    if (!userRole || userRole.length === 0) {
      return NextResponse.json(
        { error: "Forbidden", message: "You don't have permission to create internships for this company" },
        { status: 403 }
      );
    }

    // Create internship
    const [newInternship] = await db
      .insert(internships)
      .values({
        title,
        companyId,
        content,
        duration,
        lastApplyDate: new Date(lastApplyDate),
        active: active ?? true,
        isLive: isLive ?? false,
        autoCancel: autoCancel ?? false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Internship created successfully",
      internship: newInternship,
    });
  } catch (error) {
    console.error("Error creating internship:", error);
    return NextResponse.json(
      { error: "Failed to create internship", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}