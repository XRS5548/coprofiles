// app/api/search/route.ts
import { db } from "@/db";
import { companies, internships, careers, projects } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");
        const type = searchParams.get("type"); // companies, internships, careers, projects, all

        if (!query || query.length < 2) {
            return NextResponse.json({ error: "Search query must be at least 2 characters" }, { status: 400 });
        }

        const searchTerm = `%${query}%`;
        let results: any = {};

        // Search companies
        if (!type || type === "companies" || type === "all") {
            const companiesResult = await db.select()
                .from(companies)
                .where(or(
                    like(companies.name, searchTerm),
                    like(companies.description, searchTerm),
                    like(companies.category, searchTerm)
                ))
                .limit(5);
            results.companies = companiesResult;
        }

        // Search internships
        if (!type || type === "internships" || type === "all") {
            const internshipsResult = await db.select({
                id: internships.id,
                title: internships.title,
                content: internships.content,
                companyId: internships.companyId
            }).from(internships)
                .where(like(internships.title, searchTerm))
                .limit(5);
            results.internships = internshipsResult;
        }

        // Search careers
        if (!type || type === "careers" || type === "all") {
            const careersResult = await db.select({
                id: careers.id,
                name: careers.name,
                position: careers.position,
                content: careers.content
            }).from(careers)
                .where(or(
                    like(careers.name, searchTerm),
                    like(careers.position, searchTerm)
                ))
                .limit(5);
            results.careers = careersResult;
        }

        // Search projects (only public)
        if (!type || type === "projects" || type === "all") {
            const projectsResult = await db.select()
                .from(projects)
                .where(and(
                    eq(projects.isPublic, true),
                    or(
                        like(projects.name, searchTerm),
                        like(projects.description, searchTerm)
                    )
                ))
                .limit(5);
            results.projects = projectsResult;
        }

        return NextResponse.json({
            query,
            results,
            total: Object.values(results).flat().length
        });

    } catch (error) {
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}