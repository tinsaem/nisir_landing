import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

// Clears collected experiment data only — EmployeeLogin, EbcaSurveyResponse,
// GallerySignup. Never touches EmployeeAccount (the admin's own login would
// break) or any other table.
export async function POST(req) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  if (session.role !== "ADMIN")
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });

  try {
    const [logins, surveys, gallery] = await Promise.all([
      prisma.employeeLogin.deleteMany({}),
      prisma.ebcaSurveyResponse.deleteMany({}),
      prisma.gallerySignup.deleteMany({}),
    ]);

    return NextResponse.json({
      success: true,
      deleted: { logins: logins.count, surveys: surveys.count, gallery: gallery.count },
    });
  } catch (err) {
    console.error("[admin/reset POST]", err);
    return NextResponse.json({ success: false, message: "Failed to reset data." }, { status: 500 });
  }
}
