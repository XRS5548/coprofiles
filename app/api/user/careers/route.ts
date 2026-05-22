// app/api/user/careers/route.ts
import { db } from "@/db";
import { careers, companies } from "@/db/schema";
import { eq, desc, like, gte, lte, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
        const search = searchParams.get("search");
        const companyId = searchParams.get("companyId");
        const minSalary = searchParams.get("minSalary");
        const maxSalary = searchParams.get("maxSalary");
        const minTierScore = searchParams.get("minTierScore");
        const position = searchParams.get("position");
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [];

        // Search filter (title or position)
        if (search && search.trim()) {
            conditions.push(
                like(careers.name, `%${search.trim()}%`)
            );
        }

        // Company filter
        if (companyId && !isNaN(parseInt(companyId))) {
            conditions.push(eq(careers.companyId, parseInt(companyId)));
        }

        // Salary range filter
        if (minSalary && !isNaN(parseInt(minSalary))) {
            conditions.push(gte(careers.salary, parseInt(minSalary)));
        }
        if (maxSalary && !isNaN(parseInt(maxSalary))) {
            conditions.push(lte(careers.salary, parseInt(maxSalary)));
        }

        // Tier score filter
        if (minTierScore && !isNaN(parseInt(minTierScore))) {
            conditions.push(gte(careers.tierScore, parseInt(minTierScore)));
        }

        // Position filter
        if (position && position.trim()) {
            conditions.push(like(careers.position, `%${position.trim()}%`));
        }

        // Build base query
        let baseQuery = db.select({
            id: careers.id,
            name: careers.name,
            position: careers.position,
            salary: careers.salary,
            tierScore: careers.tierScore,
            content: careers.content,
            createdAt: careers.id,
            companyId: companies.id,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            companyCategory: companies.category,
            companyVerified: companies.verified
        }).from(careers)
            .innerJoin(companies, eq(careers.companyId, companies.id));

        // Apply conditions if any
        const finalQuery = conditions.length > 0 
            ? baseQuery.where(and(...conditions))
            : baseQuery;

        // Get total count
        const totalResult = await finalQuery;
        const total = totalResult.length;

        // Get paginated results
        const allCareers = await finalQuery
            .orderBy(desc(careers.id))
            .limit(limit)
            .offset(offset);

        // Get application counts for each career
        const careerIds = allCareers.map(c => c.id);
        let applicationsMap = new Map();
        
        if (careerIds.length > 0) {
            // You'll need to import careerApplications
            const { careerApplications } = await import("@/db/schema");
            const allApplications = await db.select({
                careerId: careerApplications.careerId,
                id: careerApplications.id
            }).from(careerApplications)
                .where(inArray(careerApplications.careerId, careerIds));
            
            allApplications.forEach(app => {
                applicationsMap.set(
                    app.careerId,
                    (applicationsMap.get(app.careerId) || 0) + 1
                );
            });
        }

        // Format careers with additional info
        const careersWithStats = allCareers.map(career => ({
            ...career,
            salaryFormatted: career.salary ? formatSalary(career.salary) : null,
            applicationsCount: applicationsMap.get(career.id) || 0
        }));

        return NextResponse.json({
            success: true,
            careers: careersWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            },
            filters: {
                search: search || null,
                companyId: companyId || null,
                minSalary: minSalary || null,
                maxSalary: maxSalary || null,
                minTierScore: minTierScore || null,
                position: position || null
            }
        });

    } catch (error) {
        console.error("Error fetching careers:", error);
        return NextResponse.json({ 
            success: false,
            error: "Failed to fetch careers",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// Helper function to format salary
function formatSalary(salary: number): string {
    if (salary >= 10000000) {
        return `₹${(salary / 10000000).toFixed(1)}Cr`;
    }
    if (salary >= 100000) {
        return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${salary.toLocaleString()}`;
}