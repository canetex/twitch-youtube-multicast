import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const create_team_schema = z.object({
  name: z.string().min(1).max(120),
});

export async function GET() {
  const teams = await prisma.team.findMany({
    orderBy: { createdAt: "asc" },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });
  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = create_team_schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nome do time inválido" }, { status: 400 });
  }
  const team = await prisma.team.create({
    data: { name: parsed.data.name.trim() },
    include: { streams: true },
  });
  return NextResponse.json({ team });
}
