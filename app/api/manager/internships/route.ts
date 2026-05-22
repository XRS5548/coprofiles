// app/api/manager/internships/route.ts
import { db } from "@/db";
import { internships, companies, roles, internshipApplications } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
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
            return NextResponse.json({ internships: [], message: "No companies found" });
        }

        // Get internships from these companies - FIXED: use inArray
        const allInternships = await db.select({
            id: internships.id,
            title: internships.title,
            active: internships.active,
            isLive: internships.isLive,
            lastApplyDate: internships.lastApplyDate,
            duration: internships.duration,
            autoCancel: internships.autoCancel,
            createdAt: internships.createdAt,
            companyId: internships.companyId,
            companyName: companies.name,
        }).from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(inArray(internships.companyId, companyIds))
            .orderBy(desc(internships.createdAt));

        // Get all applications in one go (more efficient)
        const internshipIds = allInternships.map(i => i.id);
        let allApplications: any[] = [];
        
        if (internshipIds.length > 0) {
            allApplications = await db.select()
                .from(internshipApplications)
                .where(inArray(internshipApplications.internshipId, internshipIds));
        }

        // Map applications count to each internship
        const internshipsWithCounts = allInternships.map(internship => ({
            ...internship,
            applicationsCount: allApplications.filter(app => app.internshipId === internship.id).length
        }));

        return NextResponse.json({ internships: internshipsWithCounts });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch internships" }, { status: 500 });
    }
}