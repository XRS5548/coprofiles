// app/api/manager/company/[id]/route.ts
import { db } from "@/db";
import { companies, roles, internships, careers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        
        // Await params - Next.js 15+ requirement
        const { id } = await params;
        const companyId = parseInt(id);

        // Check if user has access to this company
        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!userRole) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Get company details
        const company = await db.select()
            .from(companies)
            .where(eq(companies.id, companyId))
            .then(res => res[0]);

        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        // Get company stats
        const internshipsCount = await db.select()
            .from(internships)
            .where(eq(internships.companyId, companyId))
            .then(res => res.length);

        const careersCount = await db.select()
            .from(careers)
            .where(eq(careers.companyId, companyId))
            .then(res => res.length);

        // Get team members
        const team = await db.select({
            userId: users.id,
            userName: users.name,
            userRole: roles.role,
            userImg: users.profileImgUrl
        }).from(roles)
            .innerJoin(users, eq(roles.userId, users.id))
            .where(eq(roles.companyId, companyId))
            .limit(5);

        return NextResponse.json({
            ...company,
            stats: {
                internshipsCount,
                careersCount,
                teamSize: team.length
            },
            team,
            userRole: {
                role: userRole.role,
                permission: userRole.permission
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
    }
}

// PUT - Update company
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        const { id } = await params;
        const companyId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can update companies" }, { status: 403 });
        }

        // Check permission
        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission to update this company" }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, logoUrl, category } = body;

        const updatedCompany = await db.update(companies)
            .set({
                name: name || undefined,
                description: description || undefined,
                logoUrl: logoUrl || undefined,
                category: category || undefined
            })
            .where(eq(companies.id, companyId))
            .returning();

        return NextResponse.json({
            message: "Company updated successfully",
            company: updatedCompany[0]
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
    }
}



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const companyId = parseInt(resolvedParams.id);
    
    console.log("DELETE request for company ID:", companyId);

    if (isNaN(companyId)) {
      console.log("Invalid company ID");
      return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
      console.log("Decoded user:", decoded);
    } catch (err) {
      console.log("Token verification failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is founder
    const userRole = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.userId, decoded.id),
          eq(roles.companyId, companyId),
          eq(roles.role, 'Founder')
        )
      );
    
    console.log("User role found:", userRole);

    if (!userRole || userRole.length === 0) {
      return NextResponse.json({ error: "Only Founder can delete company" }, { status: 403 });
    }

    // First delete roles for this company
    await db.delete(roles).where(eq(roles.companyId, companyId));
    console.log("Roles deleted");

    // Then delete company
    await db.delete(companies).where(eq(companies.id, companyId));
    console.log("Company deleted");

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ 
      error: "Failed to delete company", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}