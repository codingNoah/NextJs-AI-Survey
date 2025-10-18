export const runtime = "nodejs";

import { parse } from "csv-parse/sync"; // or your own parser
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { computeDatasetStats, generateDataSetInsight } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const { user } = await getServerSession(authOptions);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    const stats = computeDatasetStats(records);
    const insight = await generateDataSetInsight(records, stats);

    const dataset = await prisma.dataset.create({
      data: {
        filename: file.name,
        summary: JSON.parse(JSON.stringify({ insight, stats })),
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "File successfully uploaded.",
      id: dataset.id,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to process dataset" },
      { status: 500 }
    );
  }
}
