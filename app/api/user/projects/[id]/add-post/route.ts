// app/api/user/projects/[id]/add-post/route.ts
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Fetch all posts of a project
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const project = await db.select({
            id: projects.id,
            name: projects.name,
            posts: projects.posts,
            userId: projects.userId,
            isPublic: projects.isPublic
        }).from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Check permissions
        let hasAccess = project.isPublic;
        
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                hasAccess = hasAccess || (user.id === project.userId);
            } catch (error) {
                // Invalid token, proceed with public access only
            }
        }

        if (!hasAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({
            projectId: project.id,
            projectName: project.name,
            posts: project.posts || [],
            totalPosts: project.posts?.length || 0
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST - Add a new post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        // Check if project exists and user owns it
        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject.userId !== user.id) {
            return NextResponse.json({ error: "You don't have permission to add posts to this project" }, { status: 403 });
        }

        const { url, title, description } = await request.json();
        
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Add new post to existing posts array
        const currentPosts = existingProject.posts || [];
        const newPost = { 
            url,
            title: title || null,
            description: description || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const updatedPosts = [...currentPosts, newPost];

        const updatedProject = await db.update(projects)
            .set({ posts: updatedPosts })
            .where(eq(projects.id, projectId))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Post added successfully",
            post: newPost,
            totalPosts: updatedPosts.length,
            posts: updatedProject[0].posts
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding post:", error);
        return NextResponse.json({ 
            error: "Failed to add post",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// DELETE - Remove a post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const searchParams = request.nextUrl.searchParams;
        const postIndex = parseInt(searchParams.get("index") || "-1");

        if (postIndex === -1 || isNaN(postIndex)) {
            return NextResponse.json({ error: "Post index is required" }, { status: 400 });
        }

        // Check if project exists and user owns it
        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject.userId !== user.id) {
            return NextResponse.json({ error: "You don't have permission to delete posts from this project" }, { status: 403 });
        }

        const currentPosts = existingProject.posts || [];
        
        if (postIndex >= currentPosts.length) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Remove post at index
        const updatedPosts = currentPosts.filter((_, index) => index !== postIndex);

        const updatedProject = await db.update(projects)
            .set({ posts: updatedPosts })
            .where(eq(projects.id, projectId))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully",
            totalPosts: updatedPosts.length,
            posts: updatedProject[0].posts
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}