// app/api/manager/company/[id]/verify-access/route.ts
import { db } from "@/db";
import { roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get("token")?.value;
        
        // Await params - Next.js 15+ requirement
        const { id } = await params;
        const companyId = parseInt(id);
        
        if (!token) {
            return NextResponse.json({ hasAccess: false, role: null });
        }

        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        } catch (error) {
            return NextResponse.json({ hasAccess: false, role: null });
        }

        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        return NextResponse.json({
            hasAccess: !!userRole,
            role: userRole?.role || null,
            permission: userRole?.permission || null
        });

    } catch (error) {
        console.error("Error verifying access:", error);
        return NextResponse.json({ hasAccess: false, role: null });
    }
}

// POST - Verify access with body token (alternative)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const companyId = parseInt(id);
        
        const body = await request.json();
        const token = body.token || request.cookies.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({ hasAccess: false, role: null });
        }

        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        } catch (error) {
            return NextResponse.json({ hasAccess: false, role: null });
        }

        const userRole = await db.select()
            .from(roles)
            .where(and(
                eq(roles.userId, user.id),
                eq(roles.companyId, companyId)
            ))
            .then(res => res[0]);

        return NextResponse.json({
            hasAccess: !!userRole,
            role: userRole?.role || null,
            permission: userRole?.permission || null
        });

    } catch (error) {
        console.error("Error verifying access:", error);
        return NextResponse.json({ hasAccess: false, role: null });
    }
}