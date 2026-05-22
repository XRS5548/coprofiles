// app/api/user/profile/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
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

        const userProfile = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            roleType: users.roleType,
            phoneNo: users.phoneNo,
            description: users.description,
            profileImgUrl: users.profileImgUrl,
            verified: users.verified,
            createdAt: users.createdAt,
            authBy: users.authBy
        }).from(users)
            .where(eq(users.id, user.id))
            .then(res => res[0]);

        if (!userProfile) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: userProfile });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}


// app/api/user/profile/route.ts (add PUT method)
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { name, phoneNo, description, profileImgUrl } = body;

        const updatedUser = await db.update(users)
            .set({
                name: name || undefined,
                phoneNo: phoneNo || undefined,
                description: description || undefined,
                profileImgUrl: profileImgUrl || undefined
            })
            .where(eq(users.id, user.id))
            .returning();

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser[0]
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}