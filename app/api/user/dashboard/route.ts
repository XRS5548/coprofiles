// app/api/user/dashboard/route.ts
import { db } from "@/db";
import { 
    projects, 
    internshipApplications, 
    careerApplications, 
    users,
    internships,
    careers,
    companies
} from "@/db/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Get user profile data
        const userProfile = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phoneNo: users.phoneNo,
            description: users.description,
            profileImgUrl: users.profileImgUrl,
            verified: users.verified,
            createdAt: users.createdAt,
            roleType: users.roleType
        }).from(users)
            .where(eq(users.id, user.id))
            .then(res => res[0]);

        if (!userProfile) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get counts
        const projectsCount = await db.select({ id: projects.id })
            .from(projects)
            .where(eq(projects.userId, user.id))
            .then(res => res.length);

        const internshipApplicationsCount = await db.select({ id: internshipApplications.id })
            .from(internshipApplications)
            .where(eq(internshipApplications.userId, user.id))
            .then(res => res.length);

        const careerApplicationsCount = await db.select({ id: careerApplications.id })
            .from(careerApplications)
            .where(eq(careerApplications.userId, user.id))
            .then(res => res.length);

        // Get recent projects
        const recentProjects = await db.select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            createdAt: projects.createdAt,
            isPublic: projects.isPublic,
            githubId: projects.githubId,
            posts: projects.posts
        }).from(projects)
            .where(eq(projects.userId, user.id))
            .orderBy(desc(projects.createdAt))
            .limit(5);

        // Format projects with posts count
        const formattedProjects = recentProjects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            isPublic: project.isPublic,
            githubId: project.githubId,
            postsCount: project.posts ? (Array.isArray(project.posts) ? project.posts.length : 0) : 0
        }));

        // Get recent internship applications
        const recentInternshipApps = await db.select({
            id: internshipApplications.id,
            internshipId: internships.id,
            internshipTitle: internships.title,
            internshipDuration: internships.duration,
            internshipIsLive: internships.isLive,
            companyId: companies.id,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
            certificateUnlocked: internshipApplications.certificateUnlocked,
            lastApplyDate: internships.lastApplyDate
        }).from(internshipApplications)
            .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(eq(internshipApplications.userId, user.id))
            .orderBy(desc(internshipApplications.id))
            .limit(5);

        // Get recent career applications
        const recentCareerApps = await db.select({
            id: careerApplications.id,
            careerId: careers.id,
            careerName: careers.name,
            careerPosition: careers.position,
            careerSalary: careers.salary,
            careerTierScore: careers.tierScore,
            companyId: companies.id,
            companyName: companies.name,
            companyLogo: companies.logoUrl
        }).from(careerApplications)
            .innerJoin(careers, eq(careerApplications.careerId, careers.id))
            .innerJoin(companies, eq(careers.companyId, companies.id))
            .where(eq(careerApplications.userId, user.id))
            .orderBy(desc(careerApplications.id))
            .limit(5);

        // Get upcoming deadlines (internships with deadlines in future)
        const now = new Date();
        const upcomingDeadlinesList = await db.select({
            id: internships.id,
            title: internships.title,
            companyName: companies.name,
            lastApplyDate: internships.lastApplyDate,
            duration: internships.duration
        }).from(internshipApplications)
            .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(
                eq(internshipApplications.userId, user.id),
                isNotNull(internships.lastApplyDate)
            ))
            .limit(5);

        // Filter upcoming deadlines (only future dates)
        const upcomingDeadlines = upcomingDeadlinesList.filter(deadline => 
            deadline.lastApplyDate && new Date(deadline.lastApplyDate) > now
        );

        // Get certificates earned
        const certificates = await db.select({
            id: internshipApplications.id,
            internshipTitle: internships.title,
            companyName: companies.name,
            companyLogo: companies.logoUrl
        }).from(internshipApplications)
            .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(
                eq(internshipApplications.userId, user.id),
                eq(internshipApplications.certificateUnlocked, true)
            ))
            .limit(5);

        // Build activity timeline
        const activities: any[] = [];

        // Add project activities
        recentProjects.forEach(project => {
            if (project.createdAt) {
                activities.push({
                    type: "project",
                    id: project.id,
                    title: `Created project: ${project.name}`,
                    description: project.description?.substring(0, 100) || "No description",
                    date: project.createdAt,
                    icon: "FolderGit2",
                    color: "blue"
                });
            }
        });

        // Add internship application activities
        recentInternshipApps.forEach(app => {
            activities.push({
                type: "internship_application",
                id: app.id,
                title: `Applied for: ${app.internshipTitle}`,
                description: `at ${app.companyName}`,
                date: new Date().toISOString(), // Use application created date if available
                icon: "Briefcase",
                color: "green"
            });
        });

        // Add career application activities
        recentCareerApps.forEach(app => {
            activities.push({
                type: "career_application",
                id: app.id,
                title: `Applied for: ${app.careerName}`,
                description: `${app.careerPosition || "Position"} at ${app.companyName}`,
                date: new Date().toISOString(),
                icon: "Briefcase",
                color: "purple"
            });
        });

        // Sort activities by date (newest first)
        activities.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });

        // Calculate stats
        const certificateCount = certificates.length;
        const applicationSuccessRate = internshipApplicationsCount > 0 
            ? (certificateCount / internshipApplicationsCount) * 100 
            : 0;

        // Get unique skills from applications
        const allSkills = [
            ...recentInternshipApps.map(app => app.internshipTitle).filter(Boolean),
            ...recentCareerApps.map(app => app.careerName).filter(Boolean)
        ];
        const uniqueSkills = [...new Set(allSkills)];

        // Format salary for display
        const formatSalary = (salary: number | null) => {
            if (!salary) return null;
            if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
            if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
            return `₹${salary.toLocaleString()}`;
        };

        // Format career apps with salary
        const formattedCareerApps = recentCareerApps.map(app => ({
            ...app,
            careerSalaryFormatted: formatSalary(app.careerSalary)
        }));

        return NextResponse.json({
            success: true,
            user: {
                id: userProfile.id,
                name: userProfile.name,
                email: userProfile.email,
                phoneNo: userProfile.phoneNo,
                description: userProfile.description,
                profileImgUrl: userProfile.profileImgUrl,
                verified: userProfile.verified,
                memberSince: userProfile.createdAt,
                roleType: userProfile.roleType
            },
            stats: {
                totalProjects: projectsCount,
                totalInternshipApplications: internshipApplicationsCount,
                totalCareerApplications: careerApplicationsCount,
                totalApplications: internshipApplicationsCount + careerApplicationsCount,
                totalCertificates: certificateCount,
                applicationSuccessRate: Math.round(applicationSuccessRate),
                activeApplications: recentInternshipApps.filter(app => app.internshipIsLive).length + recentCareerApps.length
            },
            recentProjects: formattedProjects,
            recentInternshipApplications: recentInternshipApps,
            recentCareerApplications: formattedCareerApps,
            upcomingDeadlines: upcomingDeadlines,
            certificates: certificates,
            recentActivities: activities.slice(0, 10),
            recommendations: {
                suggestedSkills: uniqueSkills.slice(0, 5),
                suggestedProjects: projectsCount === 0 ? [
                    "Build a portfolio website",
                    "Create a GitHub repository",
                    "Contribute to open source"
                ] : [],
                nextSteps: [
                    ...(internshipApplicationsCount === 0 ? ["Apply for your first internship"] : []),
                    ...(projectsCount === 0 ? ["Create your first project"] : []),
                    ...(certificateCount === 0 && internshipApplicationsCount > 0 ? ["Complete an internship to earn a certificate"] : [])
                ]
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json({ 
            success: false,
            error: "Failed to fetch dashboard",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}