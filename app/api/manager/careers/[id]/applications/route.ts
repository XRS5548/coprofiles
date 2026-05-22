// app/api/manager/careers/[id]/applications/route.ts
import { db } from "@/db";
import { careers, careerApplications, users, roles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        
        // Await params because in Next.js 15+ params is a Promise
        const { id } = await params;
        const careerId = parseInt(id);

        if (user.roleType !== "manager") {
            return NextResponse.json({ error: "Only managers can view applications" }, { status: 403 });
        }

        // Get career details
        const career = await db.select().from(careers)
            .where(eq(careers.id, careerId))
            .then(res => res[0]);

        if (!career) {
            return NextResponse.json({ error: "Career not found" }, { status: 404 });
        }

        // Check permission
        const userRole = await db.select().from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, career.companyId)
            ))
            .then(res => res[0]);

        if (!userRole || (userRole.permission !== "f" && userRole.permission !== "c")) {
            return NextResponse.json({ error: "You don't have permission to view applications" }, { status: 403 });
        }

        // Get all applications with user details
        const applications = await db.select({
            id: careerApplications.id,
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            userPhone: users.phoneNo,
            userProfileImg: users.profileImgUrl,
            appliedAt: careerApplications.id
        }).from(careerApplications)
            .innerJoin(users, eq(careerApplications.userId, users.id))
            .where(eq(careerApplications.careerId, careerId));

        return NextResponse.json({
            career: {
                id: career.id,
                name: career.name,
                position: career.position
            },
            totalApplications: applications.length,
            applications
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}