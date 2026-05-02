import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ teamId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { teamId } = await context.params;
  await prisma.team.deleteMany({ where: { id: teamId } });
  return NextResponse.json({ ok: true });
}
