import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";

// ================= ENUMS =================

export const authByEnum = pgEnum(
  "auth_by",
  [
    "email",
    "Github",
    "Google",
  ]
);

export const userRoleTypeEnum =
  pgEnum(
    "user_role_type",
    [
      "user",
      "manager",
    ]
  );

export const companyRoleEnum =
  pgEnum(
    "company_role",
    [
      "Founder",
      "CEO",
      "CTO",
      "HR",
      "Manager",
      "Developer",
      "Employee",
    ]
  );

export const permissionEnum =
  pgEnum(
    "permission",
    [
      "v", // view
      "c", // create + view
      "f", // full access
    ]
  );

// ================= USERS =================

export const users =
  pgTable(
    "users",
    {
      id: serial(
        "id"
      ).primaryKey(),

      name:
        varchar(
          "name",
          {
            length:
              255,
          }
        ).notNull(),

      email:
        varchar(
          "email",
          {
            length:
              255,
          }
        )
          .notNull()
          .unique(),

      password:
        text(
          "password"
        ),

      authBy:
        authByEnum(
          "auth_by"
        ).default(
          "email"
        ),

      // user / manager
      roleType:
        userRoleTypeEnum(
          "role_type"
        )
          .default(
            "user"
          )
          .notNull(),

      phoneNo:
        varchar(
          "phone_no",
          {
            length:
              20,
          }
        ),

      description:
        text(
          "description"
        ),

      profileImgUrl:
        text(
          "profile_img_url"
        ),

      verified:
        boolean(
          "verified"
        ).default(
          false
        ),

      createdAt:
        timestamp(
          "created_at"
        ).defaultNow(),
    }
  );

// ================= COMPANIES =================

export const companies =
  pgTable(
    "companies",
    {
      id: serial(
        "id"
      ).primaryKey(),

      name:
        varchar(
          "name",
          {
            length:
              255,
          }
        ).notNull(),

      verified:
        boolean(
          "verified"
        ).default(
          false
        ),

      createdAt:
        timestamp(
          "created_at"
        ).defaultNow(),

      description:
        text(
          "description"
        ),

      logoUrl:
        text(
          "logo_url"
        ),

      category:
        varchar(
          "category",
          {
            length:
              100,
          }
        ),
    }
  );

// ================= ROLES =================

export const roles =
  pgTable(
    "roles",
    {
      id: serial(
        "id"
      ).primaryKey(),

      userId:
        integer(
          "user_id"
        )
          .references(
            () =>
              users.id
          )
          .notNull(),

      companyId:
        integer(
          "company_id"
        )
          .references(
            () =>
              companies.id
          )
          .notNull(),

      role:
        companyRoleEnum(
          "role"
        ).notNull(),

      permission:
        permissionEnum(
          "permission"
        )
          .default(
            "v"
          )
          .notNull(),
    }
  );

// ================= INTERNSHIPS =================

export const internships =
  pgTable(
    "internships",
    {
      id: serial(
        "id"
      ).primaryKey(),

      title:
        varchar(
          "title",
          {
            length:
              255,
          }
        ).notNull(),

      active:
        boolean(
          "active"
        ).default(
          true
        ),

      lastApplyDate:
        timestamp(
          "last_apply_date"
        ),

      createdAt:
        timestamp(
          "created_at"
        ).defaultNow(),

      isLive:
        boolean(
          "is_live"
        ).default(
          false
        ),

      content:
        text(
          "content"
        ),

      companyId:
        integer(
          "company_id"
        )
          .references(
            () =>
              companies.id
          )
          .notNull(),

      autoCancel:
        boolean(
          "auto_cancel"
        ).default(
          false
        ),

      duration:
        integer(
          "duration"
        ), // weeks
    }
  );

export const applicationStatusEnum = pgEnum(
  "application_status",
  [
    "pending",    // Application submitted, under review
    "accepted",   // Application accepted
    "rejected",   // Application rejected
    "completed",  // Internship completed
  ]
);

// ================= INTERNSHIP APPLICATIONS =================

export const internshipApplications =
  pgTable(
    "internship_applications",
    {
      id: serial("id").primaryKey(),

      userId: integer("user_id")
        .references(() => users.id)
        .notNull(),

      internshipId: integer("internship_id")
        .references(() => internships.id)
        .notNull(),

      certificateUnlocked: boolean("certificate_unlocked").default(false),

      status: applicationStatusEnum("status").default("pending").notNull(),
      
      rollNo: varchar("roll_no", { length: 50 }),
      
      examDate: timestamp("exam_date"),

      // New field for certificate payment
      certificatePaid: boolean("certificate_paid").default(false),
    }
  );
// ================= CAREERS =================

export const careers =
  pgTable(
    "careers",
    {
      id: serial(
        "id"
      ).primaryKey(),

      name:
        varchar(
          "name",
          {
            length:
              255,
          }
        ).notNull(),

      position:
        varchar(
          "position",
          {
            length:
              255,
          }
        ),

      companyId:
        integer(
          "company_id"
        )
          .references(
            () =>
              companies.id
          )
          .notNull(),

      tierScore:
        integer(
          "tier_score"
        ),

      tierListId:
        integer(
          "tier_list_id"
        ),

      content:
        text(
          "content"
        ),

      salary:
        integer(
          "salary"
        ),
    }
  );
// ================= ENUMS (Add this with other enums) =================

export const careerApplicationStatusEnum = pgEnum(
  "career_application_status",
  [
    "pending",    // Application submitted, under review
    "reviewing",  // Application is being reviewed
    "shortlisted", // Candidate shortlisted for interview
    "interview",  // Interview scheduled
    "accepted",   // Job offer accepted
    "rejected",   // Application rejected
    "hired",      // Candidate hired
  ]
);

// ================= CAREER APPLICATIONS =================

export const careerApplications =
  pgTable(
    "career_applications",
    {
      id: serial("id").primaryKey(),

      careerId: integer("career_id")
        .references(() => careers.id)
        .notNull(),

      userId: integer("user_id")
        .references(() => users.id)
        .notNull(),

      // New fields
      status: careerApplicationStatusEnum("status")
        .default("pending")
        .notNull(),
      
      officeId: varchar("office_id", { length: 100 }), // Office/Department ID
      
      appliedDate: timestamp("applied_date").defaultNow(),
      
      resumeUrl: text("resume_url"), // URL to stored resume
      
      coverLetter: text("cover_letter"), // Cover letter text
      
      interviewDate: timestamp("interview_date"), // Scheduled interview date
      
      feedback: text("feedback"), // Feedback from employer
      
      offerLetterUrl: text("offer_letter_url"), // URL to offer letter
      
      joiningDate: timestamp("joining_date"), // Expected joining date
      
      salaryOffered: integer("salary_offered"), // Offered salary
    }
  );
// ================= PROJECTS =================

export const projects =
  pgTable(
    "projects",
    {
      id: serial(
        "id"
      ).primaryKey(),

      name:
        varchar(
          "name",
          {
            length:
              255,
          }
        ).notNull(),

      userId:
        integer(
          "user_id"
        )
          .references(
            () =>
              users.id
          )
          .notNull(),

      description:
        text(
          "description"
        ),

      createdAt:
        timestamp(
          "created_at"
        ).defaultNow(),

      isPublic:
        boolean(
          "is_public"
        ).default(
          true
        ),

      githubId:
        varchar(
          "github_id",
          {
            length:
              255,
          }
        ),

      posts:
        json(
          "posts"
        ).$type<
          {
            url: string;
          }[]
        >(),
    }
  );



  // ================= ENUMS =================

export const certificateStatusEnum = pgEnum(
  "certificate_status",
  [
    "active",        // Certificate is active and valid
    "under_review",  // Certificate is under review  
    "bounced",       // Certificate was rejected/bounced
  ]
);

// ================= CERTIFICATES =================

export const certificates = pgTable(
  "certificates",
  {
    id: serial("id").primaryKey(),

    internshipApplicationId: integer("internship_application_id")
      .references(() => internshipApplications.id)
      .notNull()
      .unique(),

    pdfUrl: text("pdf_url").notNull(),

    certificateNumber: varchar("certificate_number", { length: 100 })
      .notNull()
      .unique(), // Example: CERT-2024-001234

    userName: varchar("user_name", { length: 255 }).notNull(),
    
    internshipTitle: varchar("internship_title", { length: 255 }).notNull(),
    
    companyName: varchar("company_name", { length: 255 }).notNull(),

    issueDate: timestamp("issue_date").defaultNow().notNull(),

    status: certificateStatusEnum("status").default("active").notNull(),

    // Unique verification code - like SQR452545
    verificationCode: varchar("verification_code", { length: 50 })
      .notNull()
      .unique(),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").defaultNow(),
  }
);