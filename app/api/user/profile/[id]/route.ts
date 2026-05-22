// app/api/user/profile/[id]/route.ts
import { db } from "@/db";
import { users, projects, roles, companies, internshipApplications, careerApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Check if requesting user is authenticated (optional)
        const token = request.cookies.get("token")?.value;
        let currentUserId: number | null = null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                currentUserId = decoded.id;
            } catch (error) {
                // Invalid token, proceed as unauthenticated
            }
        }

        // Get user profile (public info)
        const user = await db.select({
            id: users.id,
            name: users.name,
            description: users.description,
            profileImgUrl: users.profileImgUrl,
            createdAt: users.createdAt,
            roleType: users.roleType
        }).from(users)
            .where(eq(users.id, userId))
            .then(res => res[0]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user's public projects
        const userProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts
        }).from(projects)
            .where(eq(projects.userId, userId))
            .orderBy(projects.createdAt)
            .limit(10);

        // Filter projects based on visibility
        const visibleProjects = userProjects.filter(project => 
            project.isPublic || currentUserId === userId
        );

        // Get user's company roles
        const userRoles = await db.select({
            companyId: companies.id,
            companyName: companies.name,
            role: roles.role,
            companyLogo: companies.logoUrl,
            companyVerified: companies.verified
        }).from(roles)
            .innerJoin(companies, eq(roles.companyId, companies.id))
            .where(eq(roles.userId, userId));

        // Get stats (only for the user themselves)
        let stats = null;
        if (currentUserId === userId) {
            const internshipAppsCount = await db.select()
                .from(internshipApplications)
                .where(eq(internshipApplications.userId, userId))
                .then(res => res.length);

            const careerAppsCount = await db.select()
                .from(careerApplications)
                .where(eq(careerApplications.userId, userId))
                .then(res => res.length);

            stats = {
                totalProjects: userProjects.length,
                totalInternshipApplications: internshipAppsCount,
                totalCareerApplications: careerAppsCount,
                totalApplications: internshipAppsCount + careerAppsCount
            };
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                description: user.description,
                profileImgUrl: user.profileImgUrl,
                createdAt: user.createdAt,
                roleType: user.roleType
            },
            projects: visibleProjects,
            companies: userRoles,
            projectsCount: visibleProjects.length,
            companiesCount: userRoles.length,
            ...(stats && { stats })
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ 
            error: "Failed to fetch user",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}