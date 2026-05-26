import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
        return new Response(JSON.stringify({ message: "Invalid email or password" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    else{
        const testpassword = await bcrypt.compare(password, user[0].password!);
        if (!testpassword) {
            return new Response(JSON.stringify({ message: "Invalid email or password" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        const token = jwt.sign({ id: user[0].id, email: user[0].email, roleType: user[0].roleType }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        
        const response = new NextResponse(JSON.stringify({ message: "Login successful", token }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "strict",
           
        });
        return response;
    }
}


// example response body
// {
//     "message": "Login successful
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0dXNlckBnbWFpbC5jb20iLCJpYXQiOjE2ODg4ODQ4MDAsImV4cCI6MTY4ODg4ODQwMH0.8sKj3n7v8z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u9X9z5m9u"
// }        