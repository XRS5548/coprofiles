// app/api/manager/profile/route.ts
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNo: users.phoneNo,
        description: users.description,
        profileImgUrl: users.profileImgUrl,
        roleType: users.roleType,
        verified: users.verified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: user[0],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };

    const body = await request.json();
    const { name, phoneNo, description, profileImgUrl } = body;

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({
        name: name || undefined,
        phoneNo: phoneNo || null,
        description: description || null,
        profileImgUrl: profileImgUrl || null,
      })
      .where(eq(users.id, decoded.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNo: updatedUser.phoneNo,
        description: updatedUser.description,
        profileImgUrl: updatedUser.profileImgUrl,
        roleType: updatedUser.roleType,
        verified: updatedUser.verified,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}