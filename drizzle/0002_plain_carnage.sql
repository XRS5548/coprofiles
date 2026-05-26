CREATE TYPE "public"."career_application_status" AS ENUM('pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected', 'hired');--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "status" "career_application_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "office_id" varchar(100);--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "applied_date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "resume_url" text;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "cover_letter" text;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "interview_date" timestamp;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "feedback" text;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "offer_letter_url" text;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "joining_date" timestamp;--> statement-breakpoint
ALTER TABLE "career_applications" ADD COLUMN "salary_offered" integer;