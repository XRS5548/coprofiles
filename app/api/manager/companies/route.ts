// app/api/manager/companys/route.ts
import { db } from "@/db";
import { companies, roles } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }

        // Verify token
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleType: string };
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid token" }, 
                { status: 401 }
            );
        }

        const userId = user.id;

        // Get all roles for this user
        const myRoles = await db
            .select()
            .from(roles)
            .where(eq(roles.userId, userId));

        if (myRoles.length === 0) {
            return NextResponse.json({ companies: [] });
        }

        // Get all companies using Promise.all
        const companyPromises = myRoles.map(async (role) => {
            const company = await db
                .select()
                .from(companies)
                .where(eq(companies.id, role.companyId))
                .then(res => res[0]);
            
            // Add role info to company
            if (company) {
                return {
                    ...company,
                    userRole: role.role,
                    userPermission: role.permission
                };
            }
            return null;
        });

        const companiesList = await Promise.all(companyPromises);
        const validCompanies = companiesList.filter(company => company !== null);

        return NextResponse.json({ 
            companies: validCompanies,
            total: validCompanies.length 
        });
        
    } catch (error) {
        console.error("Error in GET /api/manager/companys:", error);
        return NextResponse.json(
            { error: "Failed to fetch companies" }, 
            { status: 500 }
        );
    }
}