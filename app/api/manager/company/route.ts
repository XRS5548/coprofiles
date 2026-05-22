import { db } from "@/db";
import { companies, roles } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const  token = request.cookies.get("token")?.value || (await request.json()).token;

    const user = jwt.verify(token!, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const userId = user.id;

    const myRoles = await db.select().from(roles).where(eq(roles.userId, userId)).execute();

    let companys = [] as any[];


    myRoles.map(async (role) => {
        const company = await db.select().from(companies).where(eq(companies.id, role.companyId)).execute();
        companys.push(company[0]);
    })

    return  NextResponse.json({ companies: companys });
        
}



// app/api/companies/route.ts (add this POST method)
export async function POST(request: NextRequest) {
    try {
        // Get auth token
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { 
            id: number; 
            email: string; 
            roleType: string 
        };

        // Check if user is manager
        if (user.roleType !== "manager") {
            return NextResponse.json(
                { error: "Only managers can create companies" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, description, logoUrl, category } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Company name is required" },
                { status: 400 }
            );
        }

        // Check if company already exists
        const existingCompany = await db.select().from(companies)
            .where(eq(companies.name, name))
            .then(res => res[0]);

        if (existingCompany) {
            return NextResponse.json(
                { error: "Company with this name already exists" },
                { status: 409 }
            );
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
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create company" },
            { status: 500 }
        );
    }
}