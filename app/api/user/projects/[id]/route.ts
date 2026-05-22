// app/api/user/projects/[id]/route.ts
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
            description: projects.description,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts,
            userId: users.id,
            userName: users.name,
            userProfileImg: users.profileImgUrl
        }).from(projects)
            .innerJoin(users, eq(projects.userId, users.id))
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Check access
        let isOwner = false;
        let currentUser = null;
        
        if (token) {
            try {
                currentUser = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                isOwner = currentUser.id === project.userId;
            } catch (error) {
                // Invalid token
            }
        }

        if (!project.isPublic && !isOwner) {
            return NextResponse.json({ 
                error: "This project is private. You don't have access to view it." 
            }, { status: 403 });
        }

        return NextResponse.json({ 
            project: {
                ...project,
                isOwner
            }
        });

    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ 
            error: "Failed to fetch project",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function PUT(
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

        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject.userId !== user.id) {
            return NextResponse.json({ error: "You don't have permission to update this project" }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, isPublic, githubId, posts } = body;

        const updatedProject = await db.update(projects)
            .set({
                name: name !== undefined ? name : existingProject.name,
                description: description !== undefined ? description : existingProject.description,
                isPublic: isPublic !== undefined ? isPublic : existingProject.isPublic,
                githubId: githubId !== undefined ? githubId : existingProject.githubId,
                posts: posts !== undefined ? posts : existingProject.posts
            })
            .where(eq(projects.id, projectId))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject[0]
        });

    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

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

        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .then(res => res[0]);

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject.userId !== user.id) {
            return NextResponse.json({ error: "You don't have permission to delete this project" }, { status: 403 });
        }

        await db.delete(projects).where(eq(projects.id, projectId));

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}