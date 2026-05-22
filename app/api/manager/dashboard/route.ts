// app/api/manager/dashboard/route.ts
import { db } from "@/db";
import { companies, roles, internships, internshipApplications, careers, careerApplications } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
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

        // Get all companies managed by this user
        const myCompanies = await db.select({ companyId: roles.companyId })
            .from(roles)
            .where(eq(roles.userId, user.id));

        const companyIds = myCompanies.map(c => c.companyId);

        if (companyIds.length === 0) {
            return NextResponse.json({
                companiesCount: 0,
                totalInternships: 0,
                totalCareers: 0,
                totalApplications: 0,
                activeInternships: 0,
                recentInternships: []
            });
        }

        // Get internships - FIXED: use inArray
        const internshipsList = await db.select()
            .from(internships)
            .where(inArray(internships.companyId, companyIds));

        const internshipIds = internshipsList.map(i => i.id);

        // Get applications - FIXED: use inArray
        let internshipApplicationsCount = 0;
        if (internshipIds.length > 0) {
            internshipApplicationsCount = await db.select()
                .from(internshipApplications)
                .where(inArray(internshipApplications.internshipId, internshipIds))
                .then(res => res.length);
        }

        // Get careers - FIXED: use inArray
        const careersList = await db.select()
            .from(careers)
            .where(inArray(careers.companyId, companyIds));

        const careerIds = careersList.map(c => c.id);

        // Get career applications - FIXED: use inArray
        let careerApplicationsCount = 0;
        if (careerIds.length > 0) {
            careerApplicationsCount = await db.select()
                .from(careerApplications)
                .where(inArray(careerApplications.careerId, careerIds))
                .then(res => res.length);
        }

        return NextResponse.json({
            companiesCount: companyIds.length,
            totalInternships: internshipsList.length,
            totalCareers: careersList.length,
            totalApplications: internshipApplicationsCount + careerApplicationsCount,
            activeInternships: internshipsList.filter(i => i.active && i.isLive).length,
            recentInternships: internshipsList.slice(0, 5).map(i => ({
                id: i.id,
                title: i.title,
                active: i.active,
                isLive: i.isLive,
                applicationsCount: internshipApplicationsCount // You might want to calculate per internship
            }))
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}