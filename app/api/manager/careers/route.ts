// app/api/manager/careers/route.ts
import { db } from "@/db";
import { careerApplications, careers, companies, roles } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can access" }, { status: 403 });
        }

        // Get all companies where user is a manager
        const myCompanies = await db.select({ companyId: roles.companyId })
            .from(roles)
            .where(eq(roles.userId, user.id));

        const companyIds = myCompanies.map(c => c.companyId);

        if (companyIds.length === 0) {
            return NextResponse.json({ careers: [], message: "No companies found" });
        }

        // Get careers from these companies - FIXED: use inArray
        const allCareers = await db.select({
            id: careers.id,
            name: careers.name,
            position: careers.position,
            salary: careers.salary,
            tierScore: careers.tierScore,
            content: careers.content,
            companyId: careers.companyId,
            companyName: companies.name,
        }).from(careers)
            .innerJoin(companies, eq(careers.companyId, companies.id))
            .where(inArray(careers.companyId, companyIds))
            .orderBy(desc(careers.id));

        // Get all applications in one go (more efficient)
        const careerIds = allCareers.map(c => c.id);
        let allApplications: any[] = [];
        
        if (careerIds.length > 0) {
            allApplications = await db.select()
                .from(careerApplications)
                .where(inArray(careerApplications.careerId, careerIds));
        }

        // Map applications count to each career
        const careersWithCounts = allCareers.map(career => ({
            ...career,
            applicationsCount: allApplications.filter(app => app.careerId === career.id).length
        }));

        return NextResponse.json({ careers: careersWithCounts });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
    }
}