CREATE TYPE "public"."application_status" AS ENUM('pending', 'accepted', 'rejected', 'completed');--> statement-breakpoint
ALTER TABLE "internship_applications" ADD COLUMN "status" "application_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "internship_applications" ADD COLUMN "roll_no" varchar(50);--> statement-breakpoint
ALTER TABLE "internship_applications" ADD COLUMN "exam_date" timestamp;