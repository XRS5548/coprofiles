// app/api/manager/careers/bulk-create/route.ts
import { db } from "@/db";
import { careers, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface CareerInput {
    name: string;
    position?: string;
    content?: string;
    salary?: number;
    tierScore?: number;
    tierListId?: number;
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can create careers" }, { status: 403 });
        }

        const { careers: careersList, companyId } = await request.json();

        if (!careersList || !Array.isArray(careersList) || careersList.length === 0) {
            return NextResponse.json({ error: "Careers array is required" }, { status: 400 });
        }

        if (!companyId) {
            return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
        }

        // Validate permission for this company (check once for all careers)
        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ 
                error: "You don't have permission to create careers for this company" 
            }, { status: 403 });
        }

        // Insert all careers
        const insertedCareers = await db.insert(careers)
            .values(careersList.map((career: CareerInput) => ({
                name: career.name,
                position: career.position || null,
                content: career.content || null,
                salary: career.salary || null,
                tierScore: career.tierScore || null,
                tierListId: career.tierListId || null,
                companyId: companyId
            })))
            .returning();
        
        return NextResponse.json({
            message: `${insertedCareers.length} careers created successfully`,
            careers: insertedCareers
        }, { status: 201 });

    } catch (error) {
        console.error("Bulk create error:", error);
        return NextResponse.json({ 
            error: "Failed to create careers",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}