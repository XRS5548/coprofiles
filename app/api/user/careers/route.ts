// app/api/user/careers/route.ts - Fixed version
import { db } from "@/db";
import { careers, companies, careerApplications, users } from "@/db/schema";
import { eq, desc, like, gte, lte, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        let userId: number | null = null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                userId = decoded.id;
            } catch (error) {
                console.error("Token verification error:", error);
            }
        }

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

        if (search && search.trim()) {
            conditions.push(like(careers.name, `%${search.trim()}%`));
        }
        if (companyId && !isNaN(parseInt(companyId))) {
            conditions.push(eq(careers.companyId, parseInt(companyId)));
        }
        if (minSalary && !isNaN(parseInt(minSalary))) {
            conditions.push(gte(careers.salary, parseInt(minSalary)));
        }
        if (maxSalary && !isNaN(parseInt(maxSalary))) {
            conditions.push(lte(careers.salary, parseInt(maxSalary)));
        }
        if (minTierScore && !isNaN(parseInt(minTierScore))) {
            conditions.push(gte(careers.tierScore, parseInt(minTierScore)));
        }
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

        // Get career IDs
        const careerIds = allCareers.map(c => c.id);
        
        // Get application counts and user's applied status
        let applicationsMap = new Map();
        let userAppliedMap = new Map();
        let userAppliedIdMap = new Map();
        
        if (careerIds.length > 0) {
            // Get all applications for these careers
            const allApplications = await db
                .select({
                    careerId: careerApplications.careerId,
                    id: careerApplications.id,
                    userId: careerApplications.userId,
                })
                .from(careerApplications)
                .where(inArray(careerApplications.careerId, careerIds));
            
            // Count total applications per career
            allApplications.forEach(app => {
                applicationsMap.set(
                    app.careerId,
                    (applicationsMap.get(app.careerId) || 0) + 1
                );
            });
            
            // Check if user has applied to any of these careers
            if (userId) {
                const userApplications = allApplications.filter(app => app.userId === userId);
                userApplications.forEach(app => {
                    userAppliedMap.set(app.careerId, true);
                    userAppliedIdMap.set(app.careerId, app.id);
                });
            }
        }

        // Format careers with additional info (without await in map)
        const careersWithStats = [];
        for (const career of allCareers) {
            careersWithStats.push({
                ...career,
                salaryFormatted: career.salary ? formatSalary(career.salary) : null,
                applicationsCount: applicationsMap.get(career.id) || 0,
                hasApplied: userAppliedMap.get(career.id) || false,
                appliedId: userAppliedIdMap.get(career.id) || null
            });
        }

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

function formatSalary(salary: number): string {
    if (salary >= 10000000) {
        return `₹${(salary / 10000000).toFixed(1)}Cr`;
    }
    if (salary >= 100000) {
        return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${salary.toLocaleString()}`;
}