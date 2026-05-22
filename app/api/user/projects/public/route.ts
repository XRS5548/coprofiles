// app/api/user/projects/public/route.ts
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;

        // Get all public projects with user details
        const publicProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts,
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            userProfileImg: users.profileImgUrl
        }).from(projects)
            .innerJoin(users, eq(projects.userId, users.id))
            .where(eq(projects.isPublic, true))
            .orderBy(desc(projects.createdAt))
            .limit(limit)
            .offset(offset);

        const total = await db.select()
            .from(projects)
            .where(eq(projects.isPublic, true));

        return NextResponse.json({
            projects: publicProjects,
            pagination: {
                page,
                limit,
                total: total.length,
                totalPages: Math.ceil(total.length / limit)
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch public projects" }, { status: 500 });
    }
}