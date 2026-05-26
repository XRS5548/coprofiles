CREATE TYPE "public"."certificate_status" AS ENUM('active', 'under_review', 'bounced');--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"internship_application_id" integer NOT NULL,
	"pdf_url" text NOT NULL,
	"certificate_number" varchar(100) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"internship_title" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"status" "certificate_status" DEFAULT 'active' NOT NULL,
	"verification_code" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "certificates_internship_application_id_unique" UNIQUE("internship_application_id"),
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number"),
	CONSTRAINT "certificates_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_internship_application_id_internship_applications_id_fk" FOREIGN KEY ("internship_application_id") REFERENCES "public"."internship_applications"("id") ON DELETE no action ON UPDATE no action;