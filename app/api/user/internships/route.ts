// app/api/user/internships/route.ts
import { db } from "@/db";
import { internships, companies } from "@/db/schema";
import { eq, desc, like, gte, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const companyId = searchParams.get("companyId");
        const minDuration = searchParams.get("minDuration");
        const isLive = searchParams.get("isLive");
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [eq(internships.isLive, true)];

        if (search) {
            conditions.push(like(internships.title, `%${search}%`));
        }

        if (companyId) {
            conditions.push(eq(internships.companyId, parseInt(companyId)));
        }

        if (minDuration) {
            conditions.push(gte(internships.duration, parseInt(minDuration)));
        }

        if (isLive === "true") {
            conditions.push(eq(internships.isLive, true));
        }

        // Get total count
        const totalResult = await db.select({
            id: internships.id
        }).from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(...conditions));

        const total = totalResult.length;

        // Get paginated results
        const allInternships = await db.select({
            id: internships.id,
            title: internships.title,
            content: internships.content,
            duration: internships.duration,
            lastApplyDate: internships.lastApplyDate,
            isLive: internships.isLive,
            active: internships.active,
            createdAt: internships.createdAt,
            companyId: companies.id,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            companyCategory: companies.category
        }).from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(...conditions))
            .orderBy(desc(internships.createdAt))
            .limit(limit)
            .offset(offset);

        return NextResponse.json({
            internships: allInternships,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching internships:", error);
        return NextResponse.json({ error: "Failed to fetch internships" }, { status: 500 });
    }
}