CREATE TYPE "public"."field_type" AS ENUM('text', 'textarea', 'email', 'phone', 'number', 'date', 'checkbox', 'radio', 'select', 'multi_select', 'file', 'rating', 'range', 'payment');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('draft', 'active', 'paused', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."form_type" AS ENUM('public', 'private', 'authenticated');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "form_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"date" timestamp DEFAULT now(),
	"views" integer DEFAULT 0,
	"starts" integer DEFAULT 0,
	"completions" integer DEFAULT 0,
	"dropoffs" integer DEFAULT 0,
	"conversion_rate" integer DEFAULT 0,
	"desktop_count" integer DEFAULT 0,
	"mobile_count" integer DEFAULT 0,
	"tablet_count" integer DEFAULT 0,
	"direct_count" integer DEFAULT 0,
	"social_count" integer DEFAULT 0,
	"referral_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"field_label" varchar(255) NOT NULL,
	"field_name" varchar(100) NOT NULL,
	"field_type" "field_type" NOT NULL,
	"placeholder" varchar(500),
	"help_text" text,
	"is_required" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"options" json,
	"validation" json,
	"conditional_logic" json,
	"appearance" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "form_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"form_id" integer NOT NULL,
	"razorpay_order_id" varchar(255) NOT NULL,
	"razorpay_payment_id" varchar(255),
	"razorpay_signature" varchar(255),
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'INR',
	"status" "payment_status" DEFAULT 'pending',
	"customer_name" varchar(255),
	"customer_email" varchar(255),
	"customer_phone" varchar(20),
	"metadata" json,
	"receipt" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"user_id" integer,
	"submitter_name" varchar(255),
	"submitter_email" varchar(255),
	"submitter_phone" varchar(20),
	"ip_address" varchar(45),
	"user_agent" text,
	"response_data" json,
	"payment_id" varchar(255),
	"payment_status" "payment_status" DEFAULT 'pending',
	"payment_amount" integer,
	"payment_currency" varchar(3),
	"payment_receipt_url" text,
	"status" varchar(50) DEFAULT 'pending',
	"notes" text,
	"referrer" varchar(500),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"form_type" "form_type" DEFAULT 'public' NOT NULL,
	"status" "form_status" DEFAULT 'draft' NOT NULL,
	"passkey" varchar(100),
	"require_auth" boolean DEFAULT false,
	"require_email_verification" boolean DEFAULT false,
	"collect_payment" boolean DEFAULT false,
	"payment_amount" integer,
	"payment_currency" varchar(3) DEFAULT 'INR',
	"payment_description" text,
	"theme" json,
	"confirmation_message" text,
	"redirect_url" varchar(500),
	"send_email_copy" boolean DEFAULT false,
	"collect_user_data" boolean DEFAULT false,
	"max_submissions" integer,
	"submission_deadline" timestamp,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "form_analytics" ADD CONSTRAINT "form_analytics_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_payments" ADD CONSTRAINT "form_payments_submission_id_form_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_payments" ADD CONSTRAINT "form_payments_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;