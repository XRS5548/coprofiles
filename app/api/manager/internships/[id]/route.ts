// app/api/manager/internships/[id]/route.ts - Complete with proper cascade delete
import { db } from "@/db";
import { internships, companies, internshipApplications, users, roles, certificates } from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET - Fetch internship details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const internshipId = parseInt(id);
    if (isNaN(internshipId)) {
      return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
    }

    // Get internship with company details
    const internshipResult = await db
      .select({
        id: internships.id,
        title: internships.title,
        active: internships.active,
        isLive: internships.isLive,
        lastApplyDate: internships.lastApplyDate,
        duration: internships.duration,
        autoCancel: internships.autoCancel,
        createdAt: internships.createdAt,
        content: internships.content,
        companyId: internships.companyId,
        companyName: companies.name,
        companyLogo: companies.logoUrl,
        companyDescription: companies.description,
      })
      .from(internships)
      .leftJoin(companies, eq(internships.companyId, companies.id))
      .where(eq(internships.id, internshipId));

    if (!internshipResult || internshipResult.length === 0) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    const internship = internshipResult[0];

    // Get applications count
    const applicationsCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(internshipApplications)
      .where(eq(internshipApplications.internshipId, internshipId));

    const applicationsCount = Number(applicationsCountResult[0]?.count) || 0;

    // Get applications list
    const applications = await db
      .select({
        id: internshipApplications.id,
        userName: users.name,
        userEmail: users.email,
        rollNo: internshipApplications.rollNo,
        status: internshipApplications.status,
        certificateUnlocked: internshipApplications.certificateUnlocked,
        certificatePaid: internshipApplications.certificatePaid,
        examDate: internshipApplications.examDate,
      })
      .from(internshipApplications)
      .innerJoin(users, eq(internshipApplications.userId, users.id))
      .where(eq(internshipApplications.internshipId, internshipId))
      .orderBy(desc(internshipApplications.id))
      .limit(20);

    return NextResponse.json({
      success: true,
      internship: {
        ...internship,
        applicationsCount,
      },
      applications,
    });
  } catch (error) {
    console.error("Error fetching internship:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete internship with cascade

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    // ================= PARAMS =================

    const { id } = await context.params;

    const internshipId = Number(id);

    if (isNaN(internshipId)) {
      return NextResponse.json(
        {
          error: "Invalid internship id",
        },
        {
          status: 400,
        }
      );
    }

    // ================= TOKEN =================

    const token =
      request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ================= VERIFY JWT =================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: number;
      roleType: string;
    };

    if (decoded.roleType !== "manager") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // ================= FIND INTERNSHIP =================

    const internship =
      await db
        .select()
        .from(internships)
        .where(
          eq(
            internships.id,
            internshipId
          )
        )
        .limit(1);

    if (internship.length === 0) {
      return NextResponse.json(
        {
          error: "Internship not found",
        },
        {
          status: 404,
        }
      );
    }

    // ================= CHECK ROLE =================

    const role =
      await db
        .select()
        .from(roles)
        .where(
          and(
            eq(
              roles.userId,
              decoded.id
            ),
            eq(
              roles.companyId,
              internship[0].companyId
            )
          )
        )
        .limit(1);

    if (role.length === 0) {
      return NextResponse.json(
        {
          error:
            "You don't have permission",
        },
        {
          status: 403,
        }
      );
    }

    if (
      role[0].permission !== "f" &&
      role[0].role !== "Founder"
    ) {
      return NextResponse.json(
        {
          error:
            "Only Founder or Full Access user can delete internship",
        },
        {
          status: 403,
        }
      );
    }

    // ================= GET APPLICATIONS =================

    const applications =
      await db
        .select({
          id: internshipApplications.id,
        })
        .from(internshipApplications)
        .where(
          eq(
            internshipApplications.internshipId,
            internshipId
          )
        );

    const applicationIds =
      applications.map(
        (app) => app.id
      );

    // ================= TRANSACTION =================

    await db.transaction(
      async (tx) => {

        // DELETE CERTIFICATES

        if (
          applicationIds.length > 0
        ) {
          await tx
            .delete(certificates)
            .where(
              inArray(
                certificates.internshipApplicationId,
                applicationIds
              )
            );
        }

        // DELETE APPLICATIONS

        await tx
          .delete(
            internshipApplications
          )
          .where(
            eq(
              internshipApplications.internshipId,
              internshipId
            )
          );

        // DELETE INTERNSHIP

        await tx
          .delete(internships)
          .where(
            eq(
              internships.id,
              internshipId
            )
          );
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Internship deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete internship",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}