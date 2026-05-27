// app/api/user/projects/route.ts - Fixed date handling
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

        // Get user's projects with complete details
        const userProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            userId: projects.userId,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts,
            userName: users.name,
            userEmail: users.email,
        })
        .from(projects)
        .leftJoin(users, eq(projects.userId, users.id))
        .where(eq(projects.userId, decoded.id))
        .orderBy(desc(projects.createdAt));

        // Helper function to safely format date
        const formatDate = (date: Date | null | undefined): string => {
            if (!date) return 'Date not available';
            try {
                return new Date(date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            } catch {
                return 'Invalid date';
            }
        };

        // Transform projects to include computed fields
        const transformedProjects = userProjects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            userId: project.userId,
            createdAt: project.createdAt,
            isPublic: project.isPublic,
            githubId: project.githubId,
            posts: project.posts || [],
            userName: project.userName,
            userEmail: project.userEmail,
            // Add computed fields with safe date handling
            postCount: project.posts?.length || 0,
            hasGithub: !!project.githubId,
            createdAtFormatted: formatDate(project.createdAt),
        }));

        return NextResponse.json({ 
            success: true,
            projects: transformedProjects,
            total: transformedProjects.length,
            stats: {
                totalProjects: transformedProjects.length,
                publicProjects: transformedProjects.filter(p => p.isPublic).length,
                privateProjects: transformedProjects.filter(p => !p.isPublic).length,
                totalPosts: transformedProjects.reduce((sum, p) => sum + (p.postCount || 0), 0),
            }
        });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ 
            error: "Failed to fetch projects",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// POST endpoint for creating a new project
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

        const body = await request.json();
        const { name, description, isPublic, githubId, posts } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: "Project name is required" }, { status: 400 });
        }

        const [newProject] = await db.insert(projects).values({
            name: name.trim(),
            description: description || null,
            userId: decoded.id,
            isPublic: isPublic !== undefined ? isPublic : true,
            githubId: githubId || null,
            posts: posts || [],
            createdAt: new Date(),
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Project created successfully",
            project: newProject,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ 
            error: "Failed to create project",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// PUT endpoint for updating a project
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

        const body = await request.json();
        const { projectId, name, description, isPublic, githubId, posts } = body;

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        // Check if project exists and belongs to user
        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1);

        if (!existingProject || existingProject.length === 0) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject[0].userId !== decoded.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const [updatedProject] = await db.update(projects)
            .set({
                name: name !== undefined ? name.trim() : undefined,
                description: description !== undefined ? description : null,
                isPublic: isPublic !== undefined ? isPublic : undefined,
                githubId: githubId !== undefined ? githubId : null,
                posts: posts !== undefined ? posts : undefined,
            })
            .where(eq(projects.id, projectId))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject,
        });

    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ 
            error: "Failed to update project",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// DELETE endpoint for deleting a project
export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };

        const searchParams = request.nextUrl.searchParams;
        const projectId = parseInt(searchParams.get("id") || "0");

        if (!projectId || isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        // Check if project exists and belongs to user
        const existingProject = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1);

        if (!existingProject || existingProject.length === 0) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existingProject[0].userId !== decoded.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await db.delete(projects).where(eq(projects.id, projectId));

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ 
            error: "Failed to delete project",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}