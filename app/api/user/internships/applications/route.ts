// app/api/user/internships/applications/route.ts
import { db } from "@/db";
import { internshipApplications, internships, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        const applications = await db.select({
            id: internshipApplications.id,
            internshipId: internships.id,
            internshipTitle: internships.title,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            appliedAt: internshipApplications.id,
            certificateUnlocked: internshipApplications.certificateUnlocked,
            internshipActive: internships.active,
            lastApplyDate: internships.lastApplyDate
        }).from(internshipApplications)
            .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(eq(internshipApplications.userId, user.id))
            .orderBy(internshipApplications.id);

        return NextResponse.json({ applications });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}