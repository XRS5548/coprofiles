// app/api/forms/[slug]/verify/route.ts - Create this endpoint
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const { passkey } = await request.json();

    const formResult = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (!formResult || formResult.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = formResult[0];

    if (form.passkey === passkey) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid passkey" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying passkey:", error);
    return NextResponse.json({ error: "Failed to verify passkey" }, { status: 500 });
  }
}