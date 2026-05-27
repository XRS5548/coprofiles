CREATE TYPE "public"."whatsapp_account_status" AS ENUM('active', 'inactive', 'pending', 'error', 'expired');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_direction" AS ENUM('incoming', 'outgoing');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_status" AS ENUM('sent', 'delivered', 'read', 'failed', 'pending');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_message_type" AS ENUM('text', 'image', 'video', 'audio', 'document', 'location', 'contact', 'interactive', 'template', 'sticker', 'reaction');--> statement-breakpoint
CREATE TABLE "whatsapp_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"account_name" varchar(255) NOT NULL,
	"phone_number_id" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"business_account_id" varchar(255),
	"access_token" text NOT NULL,
	"token_expiry" timestamp,
	"webhook_url" varchar(500),
	"webhook_secret" varchar(255),
	"status" "whatsapp_account_status" DEFAULT 'pending',
	"verified" boolean DEFAULT false,
	"webhook_endpoint" varchar(100),
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_connected" timestamp,
	CONSTRAINT "whatsapp_accounts_webhook_endpoint_unique" UNIQUE("webhook_endpoint")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"whatsapp_account_id" integer NOT NULL,
	"customer_number" varchar(20) NOT NULL,
	"customer_name" varchar(255),
	"customer_profile" json,
	"total_messages" integer DEFAULT 0,
	"unread_count" integer DEFAULT 0,
	"last_message_at" timestamp,
	"last_message_preview" text,
	"is_active" boolean DEFAULT true,
	"assigned_to" integer,
	"tags" varchar(500)[],
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "whatsapp_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"whatsapp_account_id" integer NOT NULL,
	"media_id" varchar(255) NOT NULL,
	"media_url" text,
	"mime_type" varchar(100),
	"file_size" integer,
	"file_name" varchar(255),
	"image_data" json,
	"video_data" json,
	"audio_data" json,
	"document_data" json,
	"stored_url" text,
	"storage_provider" varchar(50) DEFAULT 'local',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "whatsapp_message_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"attachment_type" varchar(50) NOT NULL,
	"attachment_url" text,
	"attachment_id" varchar(255),
	"mime_type" varchar(100),
	"file_name" varchar(255),
	"file_size" integer,
	"thumbnail_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"whatsapp_account_id" integer NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"wa_message_id" varchar(255),
	"from_number" varchar(20),
	"to_number" varchar(20),
	"message_type" "whatsapp_message_type" NOT NULL,
	"direction" "whatsapp_message_direction" NOT NULL,
	"status" "whatsapp_message_status" DEFAULT 'pending',
	"text_body" text,
	"media_url" text,
	"media_id" varchar(255),
	"media_mime_type" varchar(100),
	"caption" text,
	"interactive_data" json,
	"template_data" json,
	"location_data" json,
	"contact_data" json,
	"metadata" json,
	"replied_to" integer,
	"reply_to_message_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"delivered_at" timestamp,
	"read_at" timestamp,
	CONSTRAINT "whatsapp_messages_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"whatsapp_account_id" integer NOT NULL,
	"template_name" varchar(255) NOT NULL,
	"template_id" varchar(255),
	"language" varchar(10) DEFAULT 'en',
	"category" varchar(100),
	"components" json,
	"header_text" text,
	"body_text" text NOT NULL,
	"footer_text" text,
	"buttons" json,
	"status" varchar(50) DEFAULT 'pending',
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "whatsapp_webhook_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"whatsapp_account_id" integer NOT NULL,
	"webhook_id" varchar(255),
	"webhook_event" varchar(100) NOT NULL,
	"request_body" text,
	"request_headers" json,
	"response_status" integer,
	"response_body" text,
	"processed" boolean DEFAULT false,
	"error" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "whatsapp_accounts" ADD CONSTRAINT "whatsapp_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_whatsapp_account_id_whatsapp_accounts_id_fk" FOREIGN KEY ("whatsapp_account_id") REFERENCES "public"."whatsapp_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_media" ADD CONSTRAINT "whatsapp_media_message_id_whatsapp_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."whatsapp_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_media" ADD CONSTRAINT "whatsapp_media_whatsapp_account_id_whatsapp_accounts_id_fk" FOREIGN KEY ("whatsapp_account_id") REFERENCES "public"."whatsapp_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_message_attachments" ADD CONSTRAINT "whatsapp_message_attachments_message_id_whatsapp_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."whatsapp_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_whatsapp_account_id_whatsapp_accounts_id_fk" FOREIGN KEY ("whatsapp_account_id") REFERENCES "public"."whatsapp_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_replied_to_whatsapp_messages_id_fk" FOREIGN KEY ("replied_to") REFERENCES "public"."whatsapp_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_whatsapp_account_id_whatsapp_accounts_id_fk" FOREIGN KEY ("whatsapp_account_id") REFERENCES "public"."whatsapp_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_webhook_logs" ADD CONSTRAINT "whatsapp_webhook_logs_whatsapp_account_id_whatsapp_accounts_id_fk" FOREIGN KEY ("whatsapp_account_id") REFERENCES "public"."whatsapp_accounts"("id") ON DELETE no action ON UPDATE no action;