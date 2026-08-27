import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const name = body.name?.trim();
  const employeeId = body.employeeId?.trim();
  const email = body.email?.trim();
  const password = body.password;

  if (!name || !employeeId || !email || !password) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  await prisma.gallerySignup.create({
    data: { name, employeeId, email, password },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
