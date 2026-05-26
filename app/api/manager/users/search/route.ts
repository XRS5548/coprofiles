// app/api/manager/users/search/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, users: [] });
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNo: users.phoneNo,
        profileImgUrl: users.profileImgUrl,
        verified: users.verified,
      })
      .from(users)
      .where(
        or(
          like(users.name, `%${q}%`),
          like(users.email, `%${q}%`)
        )
      )
      .limit(10);

    return NextResponse.json({ success: true, users: results });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}