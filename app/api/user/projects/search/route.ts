import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// app/api/user/projects/search/route.ts
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    
    if (!query) {
        return NextResponse.json({ error: "Search query required" }, { status: 400 });
    }

    const results = await db.select()
        .from(projects)
        .where(and(
            eq(projects.isPublic, true),
            like(projects.name, `%${query}%`)
        ))
        .limit(20);

    return NextResponse.json({ projects: results });
}