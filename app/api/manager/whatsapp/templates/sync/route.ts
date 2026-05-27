// app/api/manager/whatsapp/templates/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappTemplates } from "@/db/schema";
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

    const { accountId } = await request.json();

    // Get account
    const accountResult = await db
      .select()
      .from(whatsappAccounts)
      .where(and(eq(whatsappAccounts.id, accountId), eq(whatsappAccounts.userId, decoded.id)))
      .limit(1);

    if (!accountResult || accountResult.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const account = accountResult[0];

    if (!account.businessAccountId) {
      return NextResponse.json({ error: "Business account ID not found" }, { status: 400 });
    }

    // Fetch templates from Meta API
    const url = `https://graph.facebook.com/v18.0/${account.businessAccountId}/message_templates`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch templates');
    }

    // Sync templates to database
    for (const metaTemplate of data.data || []) {
      // Extract components
      let headerText = null;
      let bodyText = '';
      let footerText = null;
      let buttons = null;

      for (const component of metaTemplate.components || []) {
        if (component.type === 'HEADER') {
          headerText = component.text;
        } else if (component.type === 'BODY') {
          bodyText = component.text;
        } else if (component.type === 'FOOTER') {
          footerText = component.text;
        } else if (component.type === 'BUTTONS') {
          buttons = component.buttons;
        }
      }

      // Check if template exists
      const existingTemplate = await db
        .select()
        .from(whatsappTemplates)
        .where(and(
          eq(whatsappTemplates.whatsappAccountId, accountId),
          eq(whatsappTemplates.templateName, metaTemplate.name)
        ))
        .limit(1);

      if (existingTemplate && existingTemplate.length > 0) {
        // Update existing template
        await db
          .update(whatsappTemplates)
          .set({
            templateId: metaTemplate.id,
            status: metaTemplate.status.toLowerCase(),
            approved: metaTemplate.status === 'APPROVED',
            headerText: headerText,
            bodyText: bodyText,
            footerText: footerText,
            buttons: buttons,
            updatedAt: new Date(),
          })
          .where(eq(whatsappTemplates.id, existingTemplate[0].id));
      } else {
        // Insert new template
        await db
          .insert(whatsappTemplates)
          .values({
            whatsappAccountId: accountId,
            templateName: metaTemplate.name,
            templateId: metaTemplate.id,
            language: metaTemplate.language,
            category: metaTemplate.category,
            headerText: headerText,
            bodyText: bodyText,
            footerText: footerText,
            buttons: buttons,
            status: metaTemplate.status.toLowerCase(),
            approved: metaTemplate.status === 'APPROVED',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Templates synced successfully",
      templatesCount: data.data?.length || 0,
    });
  } catch (error) {
    console.error("Error syncing templates:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to sync templates" 
    }, { status: 500 });
  }
}