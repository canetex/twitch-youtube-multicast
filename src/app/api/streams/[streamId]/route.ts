import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ streamId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { streamId } = await context.params;
  await prisma.stream.deleteMany({ where: { id: streamId } });
  return NextResponse.json({ ok: true });
}
