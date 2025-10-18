export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(req: Request) {
  try {
    const { user } = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const datasetId = searchParams.get("id");

    if (!datasetId) {
      return NextResponse.json(
        { error: "datasetId not found" },
        { status: 400 }
      );
    }
    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId, userId: user.id },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    return NextResponse.json(dataset);
  } catch (err) {
    console.error("Error fetching datasets:", err);
    return NextResponse.json(
      { error: "Failed to fetch datasets" },
      { status: 500 }
    );
  }
}
