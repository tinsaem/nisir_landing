import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const employeeId = body.employeeId?.trim();
  const bankName = body.bankName?.trim();
  const q1 = body.q1;
  const q2 = body.q2;
  const q3 = body.q3;

  if (!employeeId || !bankName || !q1 || !q2 || !q3) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  await prisma.ebcaSurveyResponse.create({
    data: { employeeId, bankName, q1, q2, q3 },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
