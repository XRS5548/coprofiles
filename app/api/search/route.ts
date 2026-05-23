// app/api/search/route.ts
import { db } from "@/db";
import { companies, internships, careers, projects, users } from "@/db/schema";
import { like, or, and, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");
        const type = searchParams.get("type"); // companies, internships, careers, projects, all

        if (!query || query.length < 2) {
            return NextResponse.json(
                { success: false, error: "Search query must be at least 2 characters" },
                { status: 400 }
            );
        }

        const searchTerm = `%${query.toLowerCase()}%`;
        let results: any = {
            companies: [],
            internships: [],
            careers: [],
            projects: [],
        };

        // Search companies - name, description, category
        if (!type || type === "companies" || type === "all") {
            try {
                const companiesResult = await db
                    .select({
                        id: companies.id,
                        name: companies.name,
                        description: companies.description,
                        category: companies.category,
                        logoUrl: companies.logoUrl,
                        verified: companies.verified,
                        createdAt: companies.createdAt,
                    })
                    .from(companies)
                    .where(
                        or(
                            ilike(companies.name, searchTerm),
                            ilike(companies.description, searchTerm),
                            ilike(companies.category, searchTerm)
                        )
                    )
                    .limit(10);
                results.companies = companiesResult;
            } catch (e) {
                console.error("Companies search error:", e);
                results.companies = [];
            }
        }

        // Search internships - title, content
        if (!type || type === "internships" || type === "all") {
            try {
                const internshipsResult = await db
                    .select({
                        id: internships.id,
                        title: internships.title,
                        content: internships.content,
                        duration: internships.duration,
                        lastApplyDate: internships.lastApplyDate,
                        isLive: internships.isLive,
                        active: internships.active,
                        companyId: internships.companyId,
                        companyName: companies.name,
                        companyLogo: companies.logoUrl,
                        companyCategory: companies.category,
                        createdAt: internships.createdAt,
                    })
                    .from(internships)
                    .leftJoin(companies, eq(internships.companyId, companies.id))
                    .where(
                        and(
                            eq(internships.active, true),
                            or(
                                ilike(internships.title, searchTerm),
                                ilike(internships.content, searchTerm)
                            )
                        )
                    )
                    .limit(10);
                results.internships = internshipsResult;
            } catch (e) {
                console.error("Internships search error:", e);
                results.internships = [];
            }
        }

        // Search careers - name, position, content
        if (!type || type === "careers" || type === "all") {
            try {
                const careersResult = await db
                    .select({
                        id: careers.id,
                        name: careers.name,
                        position: careers.position,
                        content: careers.content,
                        salary: careers.salary,
                        tierScore: careers.tierScore,
                        companyId: careers.companyId,
                        companyName: companies.name,
                        companyLogo: companies.logoUrl,
                        companyCategory: companies.category,
                    })
                    .from(careers)
                    .leftJoin(companies, eq(careers.companyId, companies.id))
                    .where(
                        or(
                            ilike(careers.name, searchTerm),
                            ilike(careers.position, searchTerm),
                            ilike(careers.content, searchTerm)
                        )
                    )
                    .limit(10);
                results.careers = careersResult;
            } catch (e) {
                console.error("Careers search error:", e);
                results.careers = [];
            }
        }

        // Search projects - name, description (only public)
        if (!type || type === "projects" || type === "all") {
            try {
                const projectsResult = await db
                    .select({
                        id: projects.id,
                        name: projects.name,
                        description: projects.description,
                        isPublic: projects.isPublic,
                        githubId: projects.githubId,
                        createdAt: projects.createdAt,
                        userId: projects.userId,
                        userName: users.name,
                        userProfileImg: users.profileImgUrl,
                    })
                    .from(projects)
                    .leftJoin(users, eq(projects.userId, users.id))
                    .where(
                        and(
                            eq(projects.isPublic, true),
                            or(
                                ilike(projects.name, searchTerm),
                                ilike(projects.description, searchTerm)
                            )
                        )
                    )
                    .limit(10);
                results.projects = projectsResult;
            } catch (e) {
                console.error("Projects search error:", e);
                results.projects = [];
            }
        }

        // Calculate total
        let totalResults = 0;
        if (Array.isArray(results.companies)) totalResults += results.companies.length;
        if (Array.isArray(results.internships)) totalResults += results.internships.length;
        if (Array.isArray(results.careers)) totalResults += results.careers.length;
        if (Array.isArray(results.projects)) totalResults += results.projects.length;

        return NextResponse.json({
            success: true,
            query,
            results,
            total: totalResults,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Search failed",
                results: {
                    companies: [],
                    internships: [],
                    careers: [],
                    projects: [],
                },
                total: 0,
            },
            { status: 500 }
        );
    }
}