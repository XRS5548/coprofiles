// app/api/manager/internships/create/route.ts
import { db } from "@/db";
import { internships, companies, roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can create internships" }, { status: 403 });
        }

        const body = await request.json();
        const { 
            title, 
            companyId, 
            content, 
            lastApplyDate, 
            duration,
            autoCancel,
            isLive 
        } = body;

        // Validation
        if (!title || !companyId) {
            return NextResponse.json({ error: "Title and companyId are required" }, { status: 400 });
        }

        // Check if user has permission for this company
        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission to create internships for this company" }, { status: 403 });
        }

        // Check if company exists
        const company = await db.select().from(companies)
            .where(eq(companies.id, companyId))
            .then(res => res[0]);

        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        // Create internship
        const [newInternship] = await db.insert(internships).values({
            title,
            companyId,
            content: content || null,
            lastApplyDate: lastApplyDate ? new Date(lastApplyDate) : null,
            duration: duration || null,
            autoCancel: autoCancel || false,
            isLive: isLive || false,
            active: true
        }).returning();

        return NextResponse.json({
            message: "Internship created successfully",
            internship: newInternship
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create internship" }, { status: 500 });
    }
}