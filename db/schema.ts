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
            (): any =>
              users.id
          )
          .notNull(),

      companyId:
        integer(
          "company_id"
        )
          .references(
            (): any =>
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
        .references((): any => users.id)
        .notNull(),

      internshipId: integer("internship_id")
        .references((): any => internships.id)
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
            (): any =>
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
        .references((): any => careers.id)
        .notNull(),

      userId: integer("user_id")
        .references((): any => users.id)
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
            (): any =>
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




// ================= WHATSAPP ENUMS =================

export const whatsappAccountStatusEnum = pgEnum(
  "whatsapp_account_status",
  [
    "active",      // Account is active and connected
    "inactive",    // Account is inactive
    "pending",     // Waiting for verification
    "error",       // Connection error
    "expired",     // Token expired
  ]
);

export const whatsappMessageTypeEnum = pgEnum(
  "whatsapp_message_type",
  [
    "text",        // Text message
    "image",       // Image message
    "video",       // Video message
    "audio",       // Audio message
    "document",    // Document file
    "location",    // Location share
    "contact",     // Contact share
    "interactive", // Interactive/Button message
    "template",    // Template message
    "sticker",     // Sticker message
    "reaction",    // Reaction to message
  ]
);

export const whatsappMessageDirectionEnum = pgEnum(
  "whatsapp_message_direction",
  [
    "incoming",    // Message received from customer
    "outgoing",    // Message sent to customer
  ]
);

export const whatsappMessageStatusEnum = pgEnum(
  "whatsapp_message_status",
  [
    "sent",        // Message sent
    "delivered",   // Message delivered
    "read",        // Message read
    "failed",      // Message failed
    "pending",     // Message pending
  ]
);

// ================= WHATSAPP ACCOUNTS =================

export const whatsappAccounts = pgTable(
  "whatsapp_accounts",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),

    // Account details
    accountName: varchar("account_name", { length: 255 }).notNull(),
    phoneNumberId: varchar("phone_number_id", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    businessAccountId: varchar("business_account_id", { length: 255 }),
    
    // API credentials
    accessToken: text("access_token").notNull(),
    tokenExpiry: timestamp("token_expiry"),
    
    // Webhook configuration
    webhookUrl: varchar("webhook_url", { length: 500 }),
    webhookSecret: varchar("webhook_secret", { length: 255 }),
    
    // Verification status
    status: whatsappAccountStatusEnum("status").default("pending"),
    verified: boolean("verified").default(false),
    
    // Webhook endpoint (auto-generated)
    webhookEndpoint: varchar("webhook_endpoint", { length: 100 }).unique(),
    
    // Metadata
    metadata: json("metadata").$type<{
      apiVersion?: string;
      lastWebhookReceived?: string;
      webhookFailures?: number;
      rateLimit?: number;
    }>(),
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    lastConnected: timestamp("last_connected"),
  }
);

// ================= WHATSAPP WEBHOOK LOGS =================

export const whatsappWebhookLogs = pgTable(
  "whatsapp_webhook_logs",
  {
    id: serial("id").primaryKey(),

    whatsappAccountId: integer("whatsapp_account_id")
      .references((): any => whatsappAccounts.id)
      .notNull(),

    // Webhook data
    webhookId: varchar("webhook_id", { length: 255 }),
    webhookEvent: varchar("webhook_event", { length: 100 }).notNull(),
    
    // Request/Response
    requestBody: text("request_body"),
    requestHeaders: json("request_headers").$type<Record<string, string>>(),
    responseStatus: integer("response_status"),
    responseBody: text("response_body"),
    
    // Processing
    processed: boolean("processed").default(false),
    error: text("error"),
    
    createdAt: timestamp("created_at").defaultNow(),
  }
);

// ================= WHATSAPP MESSAGES =================

export const whatsappMessages: any = pgTable(
  "whatsapp_messages",
  {
    id: serial("id").primaryKey(),

    whatsappAccountId: integer("whatsapp_account_id")
      .references((): any => whatsappAccounts.id)
      .notNull(),

    // Message identifiers
    messageId: varchar("message_id", { length: 255 }).unique().notNull(),
    waMessageId: varchar("wa_message_id", { length: 255 }), // WhatsApp's message ID
    
    // Sender/Recipient
    fromNumber: varchar("from_number", { length: 20 }), // Customer number
    toNumber: varchar("to_number", { length: 20 }), // Your business number
    
    // Message content
    messageType: whatsappMessageTypeEnum("message_type").notNull(),
    direction: whatsappMessageDirectionEnum("direction").notNull(),
    status: whatsappMessageStatusEnum("status").default("pending"),
    
    // Content based on type
    textBody: text("text_body"),
    mediaUrl: text("media_url"),
    mediaId: varchar("media_id", { length: 255 }),
    mediaMimeType: varchar("media_mime_type", { length: 100 }),
    caption: text("caption"),
    
    // Interactive message data
    interactiveData: json("interactive_data").$type<{
      type?: string;
      title?: string;
      body?: string;
      buttons?: Array<{ id: string; title: string }>;
      list?: any;
    }>(),
    
    // Template message data
    templateData: json("template_data").$type<{
      name?: string;
      language?: string;
      components?: any[];
    }>(),
    
    // Location data
    locationData: json("location_data").$type<{
      latitude: number;
      longitude: number;
      name?: string;
      address?: string;
    }>(),
    
    // Contact data
    contactData: json("contact_data").$type<{
      name?: string;
      phone?: string;
      email?: string;
      organization?: string;
    }>(),
    
    // Metadata
    metadata: json("metadata").$type<{
      timestamp?: string;
      profileName?: string;
      context?: {
        from?: string;
        id?: string;
      };
    }>(),
    
    // Reply tracking
    repliedTo: integer("replied_to").references(() => whatsappMessages.id),
    replyToMessageId: varchar("reply_to_message_id", { length: 255 }),
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    deliveredAt: timestamp("delivered_at"),
    readAt: timestamp("read_at"),
  }
);

// ================= WHATSAPP MEDIA =================

export const whatsappMedia = pgTable(
  "whatsapp_media",
  {
    id: serial("id").primaryKey(),

    messageId: integer("message_id")
      .references((): any => whatsappMessages.id)
      .notNull(),

    whatsappAccountId: integer("whatsapp_account_id")
      .references((): any => whatsappAccounts.id)
      .notNull(),

    // Media details
    mediaId: varchar("media_id", { length: 255 }).notNull(),
    mediaUrl: text("media_url"),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSize: integer("file_size"),
    fileName: varchar("file_name", { length: 255 }),
    
    // Media specific
    imageData: json("image_data").$type<{
      width?: number;
      height?: number;
      caption?: string;
    }>(),
    
    videoData: json("video_data").$type<{
      duration?: number;
      width?: number;
      height?: number;
      caption?: string;
    }>(),
    
    audioData: json("audio_data").$type<{
      duration?: number;
      voice?: boolean;
    }>(),
    
    documentData: json("document_data").$type<{
      title?: string;
      caption?: string;
    }>(),
    
    // Storage
    storedUrl: text("stored_url"), // URL where media is stored in your storage
    storageProvider: varchar("storage_provider", { length: 50 }).default("local"),
    
    createdAt: timestamp("created_at").defaultNow(),
  }
);

// ================= WHATSAPP TEMPLATES =================

export const whatsappTemplates = pgTable(
  "whatsapp_templates",
  {
    id: serial("id").primaryKey(),

    whatsappAccountId: integer("whatsapp_account_id")
      .references((): any => whatsappAccounts.id)
      .notNull(),

    // Template details
    templateName: varchar("template_name", { length: 255 }).notNull(),
    templateId: varchar("template_id", { length: 255 }),
    language: varchar("language", { length: 10 }).default("en"),
    category: varchar("category", { length: 100 }),
    
    // Content
    components: json("components").$type<any[]>(),
    headerText: text("header_text"),
    bodyText: text("body_text").notNull(),
    footerText: text("footer_text"),
    
    // Buttons
    buttons: json("buttons").$type<Array<{
      type: string;
      text: string;
      url?: string;
      phoneNumber?: string;
    }>>(),
    
    // Status
    status: varchar("status", { length: 50 }).default("pending"),
    approved: boolean("approved").default(false),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

// ================= WHATSAPP CONVERSATIONS =================

export const whatsappConversations = pgTable(
  "whatsapp_conversations",
  {
    id: serial("id").primaryKey(),

    whatsappAccountId: integer("whatsapp_account_id")
      .references(() => whatsappAccounts.id)
      .notNull(),

    // Customer identifier
    customerNumber: varchar("customer_number", { length: 20 }).notNull(),
    customerName: varchar("customer_name", { length: 255 }),
    customerProfile: json("customer_profile").$type<{
      name?: string;
      avatar?: string;
      lastSeen?: string;
    }>(),
    
    // Conversation stats
    totalMessages: integer("total_messages").default(0),
    unreadCount: integer("unread_count").default(0),
    lastMessageAt: timestamp("last_message_at"),
    lastMessagePreview: text("last_message_preview"),
    
    // Status
    isActive: boolean("is_active").default(true),
    assignedTo: integer("assigned_to").references(() => users.id),
    
    // Labels/Tags
    tags: varchar("tags", { length: 500 }).array(),
    
    // Metadata
    metadata: json("metadata").$type<{
      firstContact?: string;
      lastContact?: string;
      notes?: string;
    }>(),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

// ================= WHATSAPP MESSAGE ATTACHMENTS =================

export const whatsappMessageAttachments = pgTable(
  "whatsapp_message_attachments",
  {
    id: serial("id").primaryKey(),

    messageId: integer("message_id")
      .references((): any => whatsappMessages.id)
      .notNull(),

    attachmentType: varchar("attachment_type", { length: 50 }).notNull(), // image, video, audio, document, sticker
    attachmentUrl: text("attachment_url"),
    attachmentId: varchar("attachment_id", { length: 255 }),
    mimeType: varchar("mime_type", { length: 100 }),
    fileName: varchar("file_name", { length: 255 }),
    fileSize: integer("file_size"),
    
    // Thumbnail
    thumbnailUrl: text("thumbnail_url"),
    
    createdAt: timestamp("created_at").defaultNow(),
  }
);