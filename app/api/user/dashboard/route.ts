// app/api/user/dashboard/route.ts
import { db } from "@/db";
import { projects, internshipApplications, careerApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Get counts
        const projectsCount = await db.select()
            .from(projects)
            .where(eq(projects.userId, user.id))
            .then(res => res.length);

        const internshipApplicationsCount = await db.select()
            .from(internshipApplications)
            .where(eq(internshipApplications.userId, user.id))
            .then(res => res.length);

        const careerApplicationsCount = await db.select()
            .from(careerApplications)
            .where(eq(careerApplications.userId, user.id))
            .then(res => res.length);

        // Get recent activities
        const recentProjects = await db.select()
            .from(projects)
            .where(eq(projects.userId, user.id))
            .orderBy(projects.createdAt)
            .limit(3);

        return NextResponse.json({
            stats: {
                totalProjects: projectsCount,
                totalInternshipApplications: internshipApplicationsCount,
                totalCareerApplications: careerApplicationsCount,
                totalApplications: internshipApplicationsCount + careerApplicationsCount
            },
            recentProjects,
            memberSince: user.id // You can get from users table
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}