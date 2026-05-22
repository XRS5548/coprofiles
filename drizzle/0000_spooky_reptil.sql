CREATE TYPE "public"."auth_by" AS ENUM('email', 'Github', 'Google');--> statement-breakpoint
CREATE TYPE "public"."company_role" AS ENUM('Founder', 'CEO', 'CTO', 'HR', 'Manager', 'Developer', 'Employee');--> statement-breakpoint
CREATE TYPE "public"."permission" AS ENUM('v', 'c', 'f');--> statement-breakpoint
CREATE TYPE "public"."user_role_type" AS ENUM('user', 'manager');--> statement-breakpoint
CREATE TABLE "career_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "careers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(255),
	"company_id" integer NOT NULL,
	"tier_score" integer,
	"tier_list_id" integer,
	"content" text,
	"salary" integer
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"description" text,
	"logo_url" text,
	"category" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "internship_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"internship_id" integer NOT NULL,
	"certificate_unlocked" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "internships" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"active" boolean DEFAULT true,
	"last_apply_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"is_live" boolean DEFAULT false,
	"content" text,
	"company_id" integer NOT NULL,
	"auto_cancel" boolean DEFAULT false,
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"is_public" boolean DEFAULT true,
	"github_id" varchar(255),
	"posts" json
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"role" "company_role" NOT NULL,
	"permission" "permission" DEFAULT 'v' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"auth_by" "auth_by" DEFAULT 'email',
	"role_type" "user_role_type" DEFAULT 'user' NOT NULL,
	"phone_no" varchar(20),
	"description" text,
	"profile_img_url" text,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_career_id_careers_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."careers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careers" ADD CONSTRAINT "careers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internship_applications" ADD CONSTRAINT "internship_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internship_applications" ADD CONSTRAINT "internship_applications_internship_id_internships_id_fk" FOREIGN KEY ("internship_id") REFERENCES "public"."internships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internships" ADD CONSTRAINT "internships_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;