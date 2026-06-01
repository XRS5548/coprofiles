// app/api/manager/whatsapp/send-message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappMessages, whatsappConversations, whatsappTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: number;
  roleType: string;
};

type SendPayload = {
  accountId: number;
  toNumber: string;
  message: string;
  messageType: string;
  templateName?: string;
  templateVariables?: {
    header?: string;
    body?: string[];
  };
  media?: File;
};

function getMessageTypeFromFile(file: File) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
}

function getPreviewText(messageType: string, message: string, fileName?: string) {
  if (message) return message.substring(0, 100);
  if (messageType === "image") return "Image message";
  if (messageType === "video") return "Video message";
  if (messageType === "audio") return "Audio message";
  if (messageType === "document") return fileName || "Document message";
  return "";
}

async function readPayload(request: NextRequest): Promise<SendPayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const media = formData.get("media");
    const file = media instanceof File ? media : undefined;

    return {
      accountId: Number(formData.get("accountId")),
      toNumber: String(formData.get("toNumber") || ""),
      message: String(formData.get("message") || ""),
      messageType: file ? getMessageTypeFromFile(file) : "text",
      media: file,
    };
  }

  const body = await request.json();
  return {
    accountId: Number(body.accountId),
    toNumber: body.toNumber,
    message: body.message || "",
    messageType: body.messageType || "text",
    templateName: body.templateName,
    templateVariables: body.templateVariables,
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.roleType !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { accountId, toNumber, message, messageType, templateName, templateVariables, media } =
      await readPayload(request);

    if (!accountId || !toNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!media && messageType !== "template" && !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const accountResult = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!accountResult || accountResult.length === 0) {
      return NextResponse.json({ error: "WhatsApp account not found" }, { status: 404 });
    }

    const whatsappAccount = accountResult[0];
    let responseData: { messages?: Array<{ id?: string; status?: string }>; error?: { message?: string } } = {};
    let messageId: string | undefined;
    let textBody = message;
    let mediaId: string | null = null;
    let mediaMimeType: string | null = null;
    let caption: string | null = null;
    let storedMessageType = messageType;

    if (media) {
      storedMessageType = getMessageTypeFromFile(media);
      mediaMimeType = media.type || null;
      caption = message.trim() || null;

      const uploadFormData = new FormData();
      uploadFormData.append("messaging_product", "whatsapp");
      uploadFormData.append("file", media, media.name);

      const uploadResponse = await fetch(
        `https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappAccount.accessToken}`,
          },
          body: uploadFormData,
        }
      );
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.id) {
        throw new Error(uploadData.error?.message || "Failed to upload media");
      }

      mediaId = uploadData.id;

      const mediaBody: Record<string, unknown> = {
        id: mediaId,
      };

      if (storedMessageType === "image" || storedMessageType === "video" || storedMessageType === "document") {
        if (caption) {
          mediaBody.caption = caption;
        }
      }

      if (storedMessageType === "document") {
        mediaBody.filename = media.name;
      }

      const sendResponse = await fetch(
        `https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappAccount.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: toNumber,
            type: storedMessageType,
            [storedMessageType]: mediaBody,
          }),
        }
      );

      responseData = await sendResponse.json();
      if (!sendResponse.ok) {
        throw new Error(responseData.error?.message || "Failed to send media message");
      }

      messageId = responseData.messages?.[0]?.id;
      textBody = "";
    } else if (messageType === "template" && templateName) {
      const templateResult = await db
        .select()
        .from(whatsappTemplates)
        .where(and(
          eq(whatsappTemplates.whatsappAccountId, accountId),
          eq(whatsappTemplates.templateName, templateName)
        ))
        .limit(1);

      if (!templateResult || templateResult.length === 0) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }

      const template = templateResult[0];
      const components = [];

      if (template.headerText) {
        components.push({
          type: "HEADER",
          parameters: templateVariables?.header ? [{
            type: "text",
            text: templateVariables.header
          }] : []
        });
      }

      const bodyComponents = [];
      if (templateVariables?.body && Array.isArray(templateVariables.body)) {
        for (const variable of templateVariables.body) {
          bodyComponents.push({
            type: "text",
            text: variable
          });
        }
      }

      components.push({
        type: "BODY",
        parameters: bodyComponents
      });

      if (template.footerText) {
        components.push({
          type: "FOOTER",
          parameters: []
        });
      }

      const templateBody: Record<string, unknown> = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toNumber,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: template.language || "en",
          },
          components,
        },
      };

      const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccount.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateBody),
      });

      responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error?.message || "Failed to send template message");
      }

      messageId = responseData.messages?.[0]?.id;
      textBody = template.bodyText;

      if (templateVariables?.body && Array.isArray(templateVariables.body)) {
        let previewText = template.bodyText;
        templateVariables.body.forEach((variable: string, index: number) => {
          previewText = previewText.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), variable);
        });
        textBody = previewText;
      }
    } else {
      const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccount.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: toNumber,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        }),
      });

      responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error?.message || "Failed to send message");
      }

      messageId = responseData.messages?.[0]?.id;
      textBody = message;
      storedMessageType = "text";
    }

    const previewText = getPreviewText(storedMessageType, textBody || caption || "", media?.name);

    const savedMessageResult = await db
      .insert(whatsappMessages)
      .values({
        whatsappAccountId: accountId,
        messageId: messageId || `msg_${Date.now()}`,
        waMessageId: messageId,
        toNumber: toNumber,
        fromNumber: whatsappAccount.phoneNumber,
        messageType: storedMessageType,
        direction: "outgoing",
        status: responseData.messages?.[0]?.status || "sent",
        textBody: textBody || null,
        mediaId,
        mediaMimeType,
        caption,
        templateData: storedMessageType === "template" ? { name: templateName, variables: templateVariables } : null,
        createdAt: new Date(),
      })
      .returning();

    const savedMessage = Array.isArray(savedMessageResult)
      ? savedMessageResult[0]
      : savedMessageResult.rows?.[0];

    const existingConversation = await db
      .select()
      .from(whatsappConversations)
      .where(and(
        eq(whatsappConversations.whatsappAccountId, accountId),
        eq(whatsappConversations.customerNumber, toNumber)
      ))
      .limit(1);

    if (existingConversation && existingConversation.length > 0) {
      await db
        .update(whatsappConversations)
        .set({
          lastMessageAt: new Date(),
          lastMessagePreview: previewText,
          totalMessages: (existingConversation[0].totalMessages || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(whatsappConversations.id, existingConversation[0].id));
    } else {
      await db
        .insert(whatsappConversations)
        .values({
          whatsappAccountId: accountId,
          customerNumber: toNumber,
          customerName: toNumber,
          lastMessageAt: new Date(),
          lastMessagePreview: previewText,
          totalMessages: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      response: responseData,
      savedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to send message"
    }, { status: 500 });
  }
}
