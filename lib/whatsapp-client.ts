// lib/whatsapp-client.ts
import { createBot } from 'whatsapp-cloud-api';
import { db } from "@/db";
import { whatsappAccounts, whatsappMessages, whatsappTemplates } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface WhatsAppClient {
  accountId: number;
  bot: any;
  from: string;
  token: string;
}

class WhatsAppManager {
  private clients: Map<number, WhatsAppClient> = new Map();

  async getOrCreateClient(accountId: number, accessToken: string, phoneNumberId: string) {
    if (this.clients.has(accountId)) {
      return this.clients.get(accountId)!;
    }

    const bot = createBot(phoneNumberId, accessToken);
    const client = { accountId, bot, from: phoneNumberId, token: accessToken };
    this.clients.set(accountId, client);
    return client;
  }

  async fetchTemplatesFromMeta(accountId: number, accessToken: string, businessAccountId: string) {
    try {
      const url = `https://graph.facebook.com/v18.0/${businessAccountId}/message_templates`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch templates');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching templates from Meta:', error);
      throw error;
    }
  }

  async syncTemplatesToDatabase(accountId: number) {
    try {
      // Get account details
      const account = await db
        .select()
        .from(whatsappAccounts)
        .where(eq(whatsappAccounts.id, accountId))
        .limit(1);

      if (!account || account.length === 0) {
        throw new Error('Account not found');
      }

      const whatsappAccount = account[0];

      // Fetch templates from Meta
      const metaTemplates = await this.fetchTemplatesFromMeta(
        accountId,
        whatsappAccount.accessToken,
        whatsappAccount.businessAccountId!
      );

      // Sync to local database
      for (const metaTemplate of metaTemplates) {
        // Check if template already exists
        const existingTemplate = await db
          .select()
          .from(whatsappTemplates)
          .where(eq(whatsappTemplates.templateName, metaTemplate.name))
          .limit(1);

        // Extract components
        let headerText = null;
        let bodyText = '';
        let footerText = null;
        let buttons = null;

        for (const component of metaTemplate.components) {
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
              language: metaTemplate.language,
              category: metaTemplate.category,
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

      // Return updated templates list
      const updatedTemplates = await db
        .select()
        .from(whatsappTemplates)
        .where(eq(whatsappTemplates.whatsappAccountId, accountId))
        .orderBy(whatsappTemplates.createdAt);

      return updatedTemplates;
    } catch (error) {
      console.error('Error syncing templates:', error);
      throw error;
    }
  }

  async createTemplateOnMeta(
    accountId: number,
    templateData: {
      templateName: string;
      bodyText: string;
      headerText?: string;
      footerText?: string;
      category: string;
      language: string;
    }
  ) {
    try {
      const account = await db
        .select()
        .from(whatsappAccounts)
        .where(eq(whatsappAccounts.id, accountId))
        .limit(1);

      if (!account || account.length === 0) {
        throw new Error('Account not found');
      }

      const whatsappAccount = account[0];

      // Prepare components
      const components = [];
      
      if (templateData.headerText) {
        components.push({
          type: "HEADER",
          format: "TEXT",
          text: templateData.headerText
        });
      }
      
      components.push({
        type: "BODY",
        text: templateData.bodyText
      });
      
      if (templateData.footerText) {
        components.push({
          type: "FOOTER",
          text: templateData.footerText
        });
      }

      // Call Meta API to create template
      const url = `https://graph.facebook.com/v18.0/${whatsappAccount.businessAccountId}/message_templates`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${whatsappAccount.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateData.templateName,
          category: templateData.category,
          language: templateData.language,
          components: components,
        }),
      });

      const metaResponse = await response.json();

      if (!response.ok) {
        throw new Error(metaResponse.error?.message || 'Failed to create template');
      }

      // Store in local database
      const [template] = await db
        .insert(whatsappTemplates)
        .values({
          whatsappAccountId: accountId,
          templateName: templateData.templateName,
          templateId: metaResponse.id,
          language: templateData.language,
          category: templateData.category,
          headerText: templateData.headerText || null,
          bodyText: templateData.bodyText,
          footerText: templateData.footerText || null,
          status: "pending",
          approved: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return { template, metaResponse };
    } catch (error) {
      console.error('Error creating template on Meta:', error);
      throw error;
    }
  }

  async sendTemplateMessage(
    accountId: number,
    toNumber: string,
    templateName: string,
    language: string = 'en',
    components?: any[]
  ) {
    try {
      const account = await db
        .select()
        .from(whatsappAccounts)
        .where(eq(whatsappAccounts.id, accountId))
        .limit(1);

      if (!account || account.length === 0) {
        throw new Error('Account not found');
      }

      const whatsappAccount = account[0];
      const client = await this.getOrCreateClient(
        accountId,
        whatsappAccount.accessToken,
        whatsappAccount.phoneNumberId
      );

      // Send template message using the library
      const result = await client.bot.sendTemplate(toNumber, templateName, language, components);
      
      // Store message in database
      await db.insert(whatsappMessages).values({
        whatsappAccountId: accountId,
        messageId: result.messages?.[0]?.id || `msg_${Date.now()}`,
        waMessageId: result.messages?.[0]?.id,
        toNumber: toNumber,
        fromNumber: whatsappAccount.phoneNumber,
        messageType: "template",
        direction: "outgoing",
        status: "sent",
        templateData: { name: templateName, language, components },
      });

      return result;
    } catch (error) {
      console.error('Error sending template message:', error);
      throw error;
    }
  }

  async sendTextMessage(accountId: number, toNumber: string, message: string) {
    try {
      const account = await db
        .select()
        .from(whatsappAccounts)
        .where(eq(whatsappAccounts.id, accountId))
        .limit(1);

      if (!account || account.length === 0) {
        throw new Error('Account not found');
      }

      const whatsappAccount = account[0];
      const client = await this.getOrCreateClient(
        accountId,
        whatsappAccount.accessToken,
        whatsappAccount.phoneNumberId
      );

      const result = await client.bot.sendText(toNumber, message);
      
      // Store message in database
      await db.insert(whatsappMessages).values({
        whatsappAccountId: accountId,
        messageId: result.messages?.[0]?.id || `msg_${Date.now()}`,
        waMessageId: result.messages?.[0]?.id,
        toNumber: toNumber,
        fromNumber: whatsappAccount.phoneNumber,
        messageType: "text",
        direction: "outgoing",
        status: "sent",
        textBody: message,
      });

      return result;
    } catch (error) {
      console.error('Error sending text message:', error);
      throw error;
    }
  }
}

export const whatsappManager = new WhatsAppManager();