import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappMessages, whatsappConversations, whatsappTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: number;
  roleType: string;
};

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

    const body = await request.json();
    const { accountId, templateName, templateVariables, recipients } = body;

    if (!accountId || !templateName || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Missing required fields: accountId, templateName, recipients[]" }, { status: 400 });
    }

    if (recipients.length > 500) {
      return NextResponse.json({ error: "Maximum 500 recipients per batch" }, { status: 400 });
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

    const results: Array<{
      toNumber: string;
      success: boolean;
      error?: string;
      messageId?: string;
    }> = [];

    for (const toNumber of recipients) {
      try {
        const components = [];

        if (template.headerText) {
          components.push({
            type: "HEADER",
            parameters: templateVariables?.header ? [{
              type: "text",
              text: templateVariables.header,
            }] : [],
          });
        }

        const bodyComponents: Array<{ type: string; text: string }> = [];
        if (templateVariables?.body && Array.isArray(templateVariables.body)) {
          for (const variable of templateVariables.body) {
            bodyComponents.push({ type: "text", text: variable });
          }
        }

        components.push({
          type: "BODY",
          parameters: bodyComponents,
        });

        if (template.footerText) {
          components.push({
            type: "FOOTER",
            parameters: [],
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

        const response = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappAccount.phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappAccount.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(templateBody),
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          results.push({
            toNumber,
            success: false,
            error: responseData.error?.message || "Failed to send",
          });
          continue;
        }

        const messageId = responseData.messages?.[0]?.id;

        let textBody = template.bodyText;
        if (templateVariables?.body && Array.isArray(templateVariables.body)) {
          templateVariables.body.forEach((variable: string, index: number) => {
            textBody = textBody.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), variable);
          });
        }

        await db.insert(whatsappMessages).values({
          whatsappAccountId: accountId,
          messageId: messageId || `msg_${Date.now()}_${toNumber}`,
          waMessageId: messageId,
          toNumber: toNumber,
          fromNumber: whatsappAccount.phoneNumber,
          messageType: "template",
          direction: "outgoing",
          status: responseData.messages?.[0]?.status || "sent",
          textBody: textBody || null,
          templateData: { name: templateName, variables: templateVariables },
          createdAt: new Date(),
        });

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
              lastMessagePreview: textBody.substring(0, 100),
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
              lastMessagePreview: textBody.substring(0, 100),
              totalMessages: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
        }

        results.push({
          toNumber,
          success: true,
          messageId,
        });
      } catch (err) {
        results.push({
          toNumber,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const totalSent = results.filter(r => r.success).length;
    const totalFailed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      totalRecipients: recipients.length,
      totalSent,
      totalFailed,
      results,
    });
  } catch (error) {
    console.error("Error in bulk send:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to process bulk send",
    }, { status: 500 });
  }
}
