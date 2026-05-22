// app/api/manager/company/create/route.ts
import { db } from "@/db";
import { companies, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

        // Check if user is manager
        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can create companies" }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, logoUrl, category } = body;

        if (!name) {
            return NextResponse.json({ error: "Company name is required" }, { status: 400 });
        }

        // Check if company already exists
        const existingCompany = await db.select()
            .from(companies)
            .where(eq(companies.name, name))
            .then(res => res[0]);

        if (existingCompany) {
            return NextResponse.json({ error: "Company with this name already exists" }, { status: 409 });
        }

        // Create company
        const [newCompany] = await db.insert(companies).values({
            name,
            description: description || null,
            logoUrl: logoUrl || null,
            category: category || null,
            verified: false
        }).returning();

        // Assign the creator as Founder with full access
        await db.insert(roles).values({
            userId: user.id,
            companyId: newCompany.id,
            role: "Founder",
            permission: "f" // full access
        });

        return NextResponse.json({
            message: "Company created successfully",
            company: newCompany
        }, { status: 201 });

    } catch (error) {
        console.error("Create company error:", error);
        return NextResponse.json({ 
            error: "Failed to create company",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}