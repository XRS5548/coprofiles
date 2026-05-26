// app/api/user/internships/route.ts - Fixed version without createdAt
import { db } from "@/db";
import { internships, companies, internshipApplications, users } from "@/db/schema";
import { eq, desc, like, gte, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        // Get user from token
        const token = request.cookies.get("token")?.value;
        let userId: number | null = null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                userId = decoded.id;
            } catch (error) {
                console.error("Token verification error:", error);
            }
        }

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const companyId = searchParams.get("companyId");
        const minDuration = searchParams.get("minDuration");
        const isLive = searchParams.get("isLive");
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [eq(internships.isLive, true)];

        if (search) {
            conditions.push(like(internships.title, `%${search}%`));
        }

        if (companyId) {
            conditions.push(eq(internships.companyId, parseInt(companyId)));
        }

        if (minDuration) {
            conditions.push(gte(internships.duration, parseInt(minDuration)));
        }

        if (isLive === "true") {
            conditions.push(eq(internships.isLive, true));
        }

        // Get total count
        const totalResult = await db.select({
            id: internships.id
        }).from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(...conditions));

        const total = totalResult.length;

        // Get paginated results with application status
        let allInternships;
        
        if (userId) {
            // If user is logged in, get application status
            allInternships = await db.select({
                id: internships.id,
                title: internships.title,
                content: internships.content,
                duration: internships.duration,
                lastApplyDate: internships.lastApplyDate,
                isLive: internships.isLive,
                active: internships.active,
                createdAt: internships.createdAt,
                autoCancel: internships.autoCancel,
                companyId: companies.id,
                companyName: companies.name,
                companyLogo: companies.logoUrl,
                companyCategory: companies.category,
                companyVerified: companies.verified,
                // Application status - removed createdAt since it doesn't exist
                hasApplied: sql<boolean>`CASE WHEN ${internshipApplications.id} IS NOT NULL THEN true ELSE false END`,
                applicationId: internshipApplications.id,
                certificateUnlocked: internshipApplications.certificateUnlocked
            })
            .from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .leftJoin(
                internshipApplications,
                and(
                    eq(internshipApplications.internshipId, internships.id),
                    eq(internshipApplications.userId, userId)
                )
            )
            .where(and(...conditions))
            .orderBy(desc(internships.createdAt))
            .limit(limit)
            .offset(offset);
        } else {
            // If user is not logged in, just get internships without application status
            allInternships = await db.select({
                id: internships.id,
                title: internships.title,
                content: internships.content,
                duration: internships.duration,
                lastApplyDate: internships.lastApplyDate,
                isLive: internships.isLive,
                active: internships.active,
                createdAt: internships.createdAt,
                autoCancel: internships.autoCancel,
                companyId: companies.id,
                companyName: companies.name,
                companyLogo: companies.logoUrl,
                companyCategory: companies.category,
                companyVerified: companies.verified,
                // Default values for non-logged in users
                hasApplied: sql<boolean>`false`,
                applicationId: sql<number | null>`NULL`,
                certificateUnlocked: sql<boolean>`false`
            })
            .from(internships)
            .innerJoin(companies, eq(internships.companyId, companies.id))
            .where(and(...conditions))
            .orderBy(desc(internships.createdAt))
            .limit(limit)
            .offset(offset);
        }

        // Transform the response
        const transformedInternships = allInternships.map(internship => ({
            id: internship.id,
            title: internship.title,
            description: internship.content,
            duration: internship.duration ? `${internship.duration} weeks` : 'Not specified',
            lastApplyDate: internship.lastApplyDate,
            isLive: internship.isLive,
            active: internship.active,
            createdAt: internship.createdAt,
            autoCancel: internship.autoCancel,
            company: {
                id: internship.companyId,
                name: internship.companyName,
                logo: internship.companyLogo,
                category: internship.companyCategory,
                verified: internship.companyVerified
            },
            applicationStatus: internship.hasApplied ? {
                hasApplied: true,
                applicationId: internship.applicationId,
                certificateUnlocked: internship.certificateUnlocked
            } : {
                hasApplied: false,
                applicationId: null,
                certificateUnlocked: false
            }
        }));

        return NextResponse.json({
            success: true,
            internships: transformedInternships,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching internships:", error);
        return NextResponse.json({ 
            success: false,
            error: "Failed to fetch internships",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}