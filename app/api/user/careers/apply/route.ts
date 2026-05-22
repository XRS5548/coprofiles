// app/api/user/careers/apply/route.ts
import { db } from "@/db";
import { careers, careerApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { careerId } = body;

        if (!careerId) {
            return NextResponse.json({ error: "Career ID is required" }, { status: 400 });
        }

        const careerIdNum = parseInt(careerId);
        if (isNaN(careerIdNum)) {
            return NextResponse.json({ error: "Invalid career ID" }, { status: 400 });
        }

        // Check if career exists
        const career = await db.select({
            id: careers.id,
            name: careers.name,
            position: careers.position,
            salary: careers.salary,
            tierScore: careers.tierScore,
            content: careers.content,
            companyId: careers.companyId
        }).from(careers)
            .where(eq(careers.id, careerIdNum))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career position not found" }, { status: 404 });
        }

        // Check if already applied
        const existingApplication = await db.select()
            .from(careerApplications)
            .where(and(
                eq(careerApplications.userId, user.id),
                eq(careerApplications.careerId, careerIdNum)
            ))
            .then(res => res[0]);

        if (existingApplication) {
            return NextResponse.json({ 
                error: "Already applied for this position",
                applicationId: existingApplication.id
            }, { status: 409 });
        }

        // Create application
        const [application] = await db.insert(careerApplications).values({
            userId: user.id,
            careerId: careerIdNum
        }).returning();

        // Format salary
        const formatSalary = (salary: number | null) => {
            if (salary === null) return null;
            if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
            if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
            return `₹${salary.toLocaleString()}`;
        };

        // Get total applications count for this career
        const totalApplications = await db.select()
            .from(careerApplications)
            .where(eq(careerApplications.careerId, careerIdNum))
            .then(res => res.length);

        return NextResponse.json({
            success: true,
            message: "Successfully applied for position",
            data: {
                applicationId: application.id,
                careerId: careerIdNum,
                careerName: career.name,
                careerPosition: career.position,
                careerSalary: formatSalary(career.salary),
                careerTierScore: career.tierScore,
                appliedAt: new Date().toISOString()
            },
            stats: {
                totalApplications: totalApplications
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Error applying for career:", error);
        return NextResponse.json({ 
            error: "Failed to apply for position",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}