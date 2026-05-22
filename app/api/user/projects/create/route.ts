// app/api/user/projects/create/route.ts
import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        const body = await request.json();
        const { name, description, isPublic, githubId, posts } = body;

        // Validation
        if (!name) {
            return NextResponse.json({ error: "Project name is required" }, { status: 400 });
        }

        // Create project
        const [newProject] = await db.insert(projects).values({
            name,
            userId: user.id,
            description: description || null,
            isPublic: isPublic !== undefined ? isPublic : true,
            githubId: githubId || null,
            posts: posts || null
        }).returning();

        return NextResponse.json({
            message: "Project created successfully",
            project: newProject
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}