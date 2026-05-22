// app/api/user/projects/route.ts
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Get user's projects
        const userProjects = await db.select()
            .from(projects)
            .where(eq(projects.userId, user.id))
            .orderBy(desc(projects.createdAt));

        return NextResponse.json({ 
            projects: userProjects,
            total: userProjects.length
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}