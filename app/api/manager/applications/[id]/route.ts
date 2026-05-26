// app/api/manager/applications/[id]/route.ts - Single application API
import { db } from "@/db";
import {
  internshipApplications,
  users,
  internships,
  companies,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: number;
  email: string;
  roleType: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const applicationId = parseInt(resolvedParams.id);

    if (isNaN(applicationId)) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    if (decoded.roleType !== "manager") {
      return NextResponse.json(
        { success: false, message: "Only managers allowed" },
        { status: 403 }
      );
    }

    // Fetch single application with all details
    const result = await db
      .select({
        applicationId: internshipApplications.id,
        status: internshipApplications.status,
        rollNo: internshipApplications.rollNo,
        examDate: internshipApplications.examDate,
        certificateUnlocked: internshipApplications.certificateUnlocked,
        certificatePaid: internshipApplications.certificatePaid,
        userId: users.id,
        userName: users.name,
        email: users.email,
        phone: users.phoneNo,
        profileImgUrl: users.profileImgUrl,
        internshipId: internships.id,
        internshipTitle: internships.title,
        internshipContent: internships.content,
        internshipDuration: internships.duration,
        internshipLastApplyDate: internships.lastApplyDate,
        companyId: companies.id,
        companyName: companies.name,
        companyLogo: companies.logoUrl,
      })
      .from(internshipApplications)
      .innerJoin(users, eq(internshipApplications.userId, users.id))
      .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
      .innerJoin(companies, eq(internships.companyId, companies.id))
      .where(eq(internshipApplications.id, applicationId));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    const application = result[0];

    return NextResponse.json({
      success: true,
      application: {
        applicationId: application.applicationId,
        status: application.status,
        rollNo: application.rollNo,
        examDate: application.examDate,
        certificateUnlocked: application.certificateUnlocked,
        certificatePaid: application.certificatePaid,
        userId: application.userId,
        userName: application.userName,
        email: application.email,
        phone: application.phone,
        profileImgUrl: application.profileImgUrl,
        internshipId: application.internshipId,
        internshipTitle: application.internshipTitle,
        internshipContent: application.internshipContent,
        internshipDuration: application.internshipDuration,
        internshipLastApplyDate: application.internshipLastApplyDate,
        companyId: application.companyId,
        companyName: application.companyName,
        companyLogo: application.companyLogo,
      },
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}