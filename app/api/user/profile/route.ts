// app/api/user/profile/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// GET - Fetch user profile
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

        return NextResponse.json({ 
            success: true,
            user: userProfile 
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ 
            error: "Failed to fetch profile" 
        }, { status: 500 });
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { name, phoneNo, description, profileImgUrl } = body;

        // Build update data (only include fields that are provided)
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phoneNo !== undefined) updateData.phoneNo = phoneNo;
        if (description !== undefined) updateData.description = description;
        if (profileImgUrl !== undefined) updateData.profileImgUrl = profileImgUrl;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ 
                error: "No fields to update" 
            }, { status: 400 });
        }

        const updatedUser = await db.update(users)
            .set(updateData)
            .where(eq(users.id, user.id))
            .returning();

        if (!updatedUser || updatedUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser[0].id,
                name: updatedUser[0].name,
                email: updatedUser[0].email,
                phoneNo: updatedUser[0].phoneNo,
                description: updatedUser[0].description,
                profileImgUrl: updatedUser[0].profileImgUrl,
                roleType: updatedUser[0].roleType,
                verified: updatedUser[0].verified
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ 
            error: "Failed to update profile" 
        }, { status: 500 });
    }
}

// PATCH - Partial update (same as PUT but more RESTful)
export async function PATCH(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { name, phoneNo, description, profileImgUrl } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phoneNo !== undefined) updateData.phoneNo = phoneNo;
        if (description !== undefined) updateData.description = description;
        if (profileImgUrl !== undefined) updateData.profileImgUrl = profileImgUrl;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ 
                error: "No fields to update" 
            }, { status: 400 });
        }

        const updatedUser = await db.update(users)
            .set(updateData)
            .where(eq(users.id, user.id))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser[0]
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ 
            error: "Failed to update profile" 
        }, { status: 500 });
    }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { password, confirmDelete } = body;

        // Require confirmation
        if (!confirmDelete) {
            return NextResponse.json({ 
                error: "Please confirm account deletion" 
            }, { status: 400 });
        }

        // Get user to verify password
        const existingUser = await db.select({
            id: users.id,
            password: users.password,
            email: users.email
        }).from(users)
            .where(eq(users.id, user.id))
            .then(res => res[0]);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify password if user has password set
        if (existingUser.password) {
            if (!password) {
                return NextResponse.json({ 
                    error: "Password is required to delete account" 
                }, { status: 400 });
            }

            const isValidPassword = await bcrypt.compare(password, existingUser.password);
            if (!isValidPassword) {
                return NextResponse.json({ 
                    error: "Invalid password" 
                }, { status: 401 });
            }
        }

        // Delete user (cascade will handle related records if set up)
        await db.delete(users).where(eq(users.id, user.id));

        // Clear the cookie
        const response = NextResponse.json({
            success: true,
            message: "Account deleted successfully"
        });
        response.cookies.delete("token");

        return response;

    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json({ 
            error: "Failed to delete account" 
        }, { status: 500 });
    }
}

// POST - Change password (additional endpoint)
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const body = await request.json();
        const { currentPassword, newPassword, confirmNewPassword } = body;

        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return NextResponse.json({ 
                error: "All password fields are required" 
            }, { status: 400 });
        }

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json({ 
                error: "New passwords do not match" 
            }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ 
                error: "Password must be at least 6 characters" 
            }, { status: 400 });
        }

        // Get user with password
        const existingUser = await db.select({
            id: users.id,
            password: users.password,
            email: users.email
        }).from(users)
            .where(eq(users.id, user.id))
            .then(res => res[0]);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify current password
        if (existingUser.password) {
            const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isValidPassword) {
                return NextResponse.json({ 
                    error: "Current password is incorrect" 
                }, { status: 401 });
            }
        } else {
            // User signed up with OAuth, can't change password
            return NextResponse.json({ 
                error: "This account uses OAuth. Password cannot be changed." 
            }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, user.id));

        return NextResponse.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json({ 
            error: "Failed to change password" 
        }, { status: 500 });
    }
}