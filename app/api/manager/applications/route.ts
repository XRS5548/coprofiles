import { db } from "@/db";
import {
  roles,
  companies,
  internships,
  internshipApplications,
  users,
} from "@/db/schema";

import { eq, inArray } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // decode jwt
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: number;
      email: string;
      roleType: string;
    };

    // optional manager check
    if (decoded.roleType !== "manager") {
      return NextResponse.json(
        { message: "Only manager allowed" },
        { status: 403 }
      );
    }

    // get companies of this manager
    const companyRoles = await db
      .select()
      .from(roles)
      .where(eq(roles.userId, decoded.id));

    if (companyRoles.length === 0) {
      return NextResponse.json({
        companies: [],
      });
    }

    const companyIds =
      companyRoles.map(
        (r) => r.companyId
      );

    // company data
    const companyData =
      await db
        .select()
        .from(companies)
        .where(
          inArray(
            companies.id,
            companyIds
          )
        );

    // internships of those companies
    const internshipData =
      await db
        .select()
        .from(internships)
        .where(
          inArray(
            internships.companyId,
            companyIds
          )
        );

    const internshipIds =
      internshipData.map(
        (i) => i.id
      );

    if (internshipIds.length === 0) {
      return NextResponse.json({
        companies: companyData,
        internships: [],
      });
    }

    // applications
    const apps =
      await db
        .select({
          applicationId:
            internshipApplications.id,

          status:
            internshipApplications.status,

          rollNo:
            internshipApplications.rollNo,

          examDate:
            internshipApplications.examDate,

          internshipId:
            internships.id,

          internshipTitle:
            internships.title,

          companyId:
            companies.id,

          companyName:
            companies.name,

          userId:
            users.id,

          userName:
            users.name,

          email:
            users.email,

          phone:
            users.phoneNo,

          profile:
            users.profileImgUrl,
        })
        .from(
          internshipApplications
        )
        .innerJoin(
          users,
          eq(
            internshipApplications.userId,
            users.id
          )
        )
        .innerJoin(
          internships,
          eq(
            internshipApplications.internshipId,
            internships.id
          )
        )
        .innerJoin(
          companies,
          eq(
            internships.companyId,
            companies.id
          )
        )
        .where(
          inArray(
            internships.id,
            internshipIds
          )
        );

    return NextResponse.json(
      {
        companies:
          companyData,
        internships:
          internshipData,
        applications:
          apps,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}