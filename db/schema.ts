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

// ================= INTERNSHIP APPLICATIONS =================

export const internshipApplications =
  pgTable(
    "internship_applications",
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

      internshipId:
        integer(
          "internship_id"
        )
          .references(
            () =>
              internships.id
          )
          .notNull(),

      certificateUnlocked:
        boolean(
          "certificate_unlocked"
        ).default(
          false
        ),
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

// ================= CAREER APPLICATIONS =================

export const careerApplications =
  pgTable(
    "career_applications",
    {
      id: serial(
        "id"
      ).primaryKey(),

      careerId:
        integer(
          "career_id"
        )
          .references(
            () =>
              careers.id
          )
          .notNull(),

      userId:
        integer(
          "user_id"
        )
          .references(
            () =>
              users.id
          )
          .notNull(),
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