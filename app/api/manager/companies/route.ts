// app/api/manager/companies/route.ts - For fetching companies
import { db } from "@/db";
import { companies, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    
    // Get companies where user has a role
    const userCompanies = await db
      .select({
        id: companies.id,
        name: companies.name,
        logoUrl: companies.logoUrl,
        category: companies.category,
        verified: companies.verified,
        role: roles.role,
        permission: roles.permission,
      })
      .from(roles)
      .innerJoin(companies, eq(roles.companyId, companies.id))
      .where(eq(roles.userId, decoded.id));

    return NextResponse.json({
      success: true,
      companies: userCompanies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Only managers can create companies" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, logoUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // Create company
    const [newCompany] = await db
      .insert(companies)
      .values({
        name,
        description: description || null,
        category: category || null,
        logoUrl: logoUrl || null,
        verified: false,
      })
      .returning();

    // Assign user as manager with full access
    await db.insert(roles).values({
      userId: decoded.id,
      companyId: newCompany.id,
      role: 'Founder', // Role name can be anything, e.g., Founder, Admin, etc.
      permission: 'f', // Full access
    });

    return NextResponse.json({
      success: true,
      message: "Company created successfully",
      company: newCompany,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}