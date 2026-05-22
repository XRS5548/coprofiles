// app/api/user/careers/applications/route.ts
import { db } from "@/db";
import { careerApplications, careers, companies } from "@/db/schema";
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
            id: careerApplications.id,
            careerId: careers.id,
            careerName: careers.name,
            position: careers.position,
            salary: careers.salary,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            appliedAt: careerApplications.id
        }).from(careerApplications)
            .innerJoin(careers, eq(careerApplications.careerId, careers.id))
            .innerJoin(companies, eq(careers.companyId, companies.id))
            .where(eq(careerApplications.userId, user.id))
            .orderBy(careerApplications.id);

        return NextResponse.json({ applications });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}