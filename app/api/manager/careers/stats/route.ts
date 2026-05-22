// app/api/manager/careers/stats/route.ts
import { db } from "@/db";
import { careers, careerApplications, companies, roles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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
            return NextResponse.json({ error: "Only managers can access stats" }, { status: 403 });
        }

        // Get all companies where user is manager
        const myCompanies = await db.select({ companyId: roles.companyId })
            .from(roles)
            .where(eq(roles.userId, user.id));

        const companyIds = myCompanies.map(c => c.companyId);

        if (companyIds.length === 0) {
            return NextResponse.json({ 
                totalCareers: 0,
                totalApplications: 0,
                companiesWithCareers: 0,
                topCareers: []
            });
        }

        // Get all careers from these companies - FIXED: use inArray
        const allCareers = await db.select()
            .from(careers)
            .where(inArray(careers.companyId, companyIds));

        // Get all applications for these careers
        const careerIds = allCareers.map(c => c.id);
        let allApplications: any[] = [];
        
        if (careerIds.length > 0) {
            // FIXED: use inArray instead of .in
            allApplications = await db.select()
                .from(careerApplications)
                .where(inArray(careerApplications.careerId, careerIds));
        }

        // Calculate stats per career
        const careersWithStats = allCareers.map(career => {
            const applications = allApplications.filter(app => app.careerId === career.id);
            return {
                id: career.id,
                name: career.name,
                position: career.position,
                applicationsCount: applications.length,
                salary: career.salary
            };
        });

        // Sort by applications count
        const topCareers = careersWithStats
            .sort((a, b) => b.applicationsCount - a.applicationsCount)
            .slice(0, 5);

        return NextResponse.json({
            totalCareers: allCareers.length,
            totalApplications: allApplications.length,
            companiesWithCareers: new Set(allCareers.map(c => c.companyId)).size,
            averageApplicationsPerCareer: allCareers.length > 0 
                ? Math.round(allApplications.length / allCareers.length) 
                : 0,
            topCareers
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}