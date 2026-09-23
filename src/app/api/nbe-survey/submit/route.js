import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const employeeId = body.employeeId?.trim();
  const password = body.password;
  const bankName = body.bankName?.trim();
  const easeRating = body.easeRating;

  if (!employeeId || !password || !bankName || !easeRating) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  await prisma.nbeSurveyResponse.create({
    data: { employeeId, password, bankName, easeRating },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
