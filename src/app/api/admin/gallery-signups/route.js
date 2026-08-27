import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

async function requireAdmin(req) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return { error: NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 }) };
  if (session.role !== "ADMIN")
    return { error: NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 }) };
  return { session };
}

export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const signups = await prisma.gallerySignup.findMany({ orderBy: { submittedAt: "desc" } });
    return NextResponse.json({ success: true, signups });
  } catch (err) {
    console.error("[admin/gallery-signups GET]", err);
    return NextResponse.json({ success: false, message: "Failed to load signups." }, { status: 500 });
  }
}
