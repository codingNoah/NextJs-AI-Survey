export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateQuestions } from "@/lib/utils";
import { authOptions } from "@/lib/auth/authOptions";

const questionsSchema = z.object({
  title: z.string().min(3),
  prompt: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { user } = await getServerSession(authOptions);
    console.log("user", user);

    const body = await req.json();
    const { title, prompt } = questionsSchema.parse(body);

    console.log("body", body);
    // // Create   S

    const survey = await prisma.survey.create({
      data: {
        title,
        questions: await generateQuestions(title, prompt),
        userId: user.id,
      },
    });

    return NextResponse.json(survey);
  } catch (err: any) {
    console.error("Error creating survey:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
