export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const responseSchema = z.object({
  answers: z
    .array(z.string().min(1, "Answer cannot be empty"))
    .nonempty("At least one answer is required"),
  surveyId: z
    .string({
      required_error: "surveyId is required",
      invalid_type_error: "surveyId must be a string",
    })
    .min(1, "surveyId cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const { user } = await getServerSession(authOptions);
    console.log("user", user);

    const body = await req.json();
    const { answers, surveyId } = responseSchema.parse(body);

    console.log("body", body);

    const response = await prisma.response.create({
      data: {
        answers,
        surveyId,
        userId: user.id,
      },
    });

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error creating survey:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
