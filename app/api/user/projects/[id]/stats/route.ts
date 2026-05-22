// app/api/user/projects/[id]/stats/route.ts
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        
        // Await params - Next.js 15+ requirement
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }
        
        // Get project
        const project = await db.select({
            id: projects.id,
            name: projects.name,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts,
            userId: projects.userId
        }).from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Check access (only owner or public project)
        let isOwner = false;
        
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                isOwner = user.id === project.userId;
            } catch (error) {
                // Invalid token
            }
        }

        if (!project.isPublic && !isOwner) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Calculate stats
        const stats = {
            id: project.id,
            name: project.name,
            createdAt: project.createdAt,
            isPublic: project.isPublic,
            hasGithub: !!project.githubId,
            postsCount: project.posts?.length || 0,
            githubUrl: project.githubId ? `https://github.com/${project.githubId}` : null
        };

        return NextResponse.json({ stats });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch project stats" }, { status: 500 });
    }
}