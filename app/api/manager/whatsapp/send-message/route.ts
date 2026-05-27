// app/api/manager/whatsapp/send-message/route.ts - Complete with template support
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappMessages, whatsappConversations, whatsappTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
    if (decoded.roleType !== 'manager') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { accountId, toNumber, message, messageType, templateName, templateVariables } = await request.json();

    console.log("Sending message:", { accountId, toNumber, message, messageType, templateName, templateVariables });

    // Get WhatsApp account
    const accountResult = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!accountResult || accountResult.length === 0) {
      return NextResponse.json({ error: "WhatsApp account not found" }, { status: 404 });
    }

    const whatsappAccount = accountResult[0];
    let responseData;
    let messageId;
    let textBody = message;

    // Send based on message type
    if (messageType === "template" && templateName) {
      // Get template from database
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

      // Prepare template components
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
      
      // Body with variables
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

      // Send template message via WhatsApp API
      const url = `https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`;
      
      const templateBody: any = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toNumber,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: template.language || "en",
          },
        },
      };

      if (components.length > 0) {
        templateBody.template.components = components;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccount.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateBody),
      });

      responseData = await response.json();
      console.log("WhatsApp Template API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error?.message || "Failed to send template message");
      }

      messageId = responseData.messages?.[0]?.id;
      textBody = template.bodyText;
      
      // Replace variables in text body for preview
      if (templateVariables?.body && Array.isArray(templateVariables.body)) {
        let previewText = template.bodyText;
        templateVariables.body.forEach((variable: string, index: number) => {
          previewText = previewText.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, 'g'), variable);
        });
        textBody = previewText;
      }
    } else {
      // Send text message
      const url = `https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`;
      
      const response = await fetch(url, {
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
      console.log("WhatsApp Text API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error?.message || "Failed to send message");
      }

      messageId = responseData.messages?.[0]?.id;
      textBody = message;
    }

    // Store message in database
    const savedMessageResult = await db
      .insert(whatsappMessages)
      .values({
        whatsappAccountId: accountId,
        messageId: messageId || `msg_${Date.now()}`,
        waMessageId: messageId,
        toNumber: toNumber,
        fromNumber: whatsappAccount.phoneNumber,
        messageType: messageType === "template" ? "template" : "text",
        direction: "outgoing",
        status: responseData.messages?.[0]?.status || "sent",
        textBody: textBody,
        templateData: messageType === "template" ? { name: templateName, variables: templateVariables } : null,
        createdAt: new Date(),
      })
      .returning();

    const savedMessage = Array.isArray(savedMessageResult)
      ? savedMessageResult[0]
      : savedMessageResult.rows?.[0];

    console.log("Message stored in DB:", savedMessage);

    // Update or create conversation
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
          lastMessagePreview: textBody?.substring(0, 100) || '',
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
          lastMessagePreview: textBody?.substring(0, 100) || '',
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