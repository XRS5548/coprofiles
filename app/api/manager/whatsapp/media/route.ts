import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappAccounts, whatsappMessages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: number;
  roleType: string;
};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.roleType !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messageId = Number(request.nextUrl.searchParams.get("messageId"));
    if (!Number.isInteger(messageId) || messageId <= 0) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    const [message] = await db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.id, messageId))
      .limit(1);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const [account] = await db
      .select()
      .from(whatsappAccounts)
      .where(
        and(
          eq(whatsappAccounts.id, message.whatsappAccountId),
          eq(whatsappAccounts.userId, decoded.id)
        )
      )
      .limit(1);

    if (!account) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!message.mediaId) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${message.mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
      }
    );

    const metaData = await metaResponse.json();
    if (!metaResponse.ok || !metaData.url) {
      return NextResponse.json(
        { error: metaData.error?.message || "Failed to fetch media URL" },
        { status: metaResponse.status || 502 }
      );
    }

    const mediaResponse = await fetch(metaData.url, {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    });

    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download media" },
        { status: mediaResponse.status || 502 }
      );
    }

    const contentType =
      mediaResponse.headers.get("content-type") ||
      metaData.mime_type ||
      message.mediaMimeType ||
      "application/octet-stream";

    return new Response(await mediaResponse.arrayBuffer(), {
      headers: {
        "Cache-Control": "private, max-age=300",
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching WhatsApp media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
