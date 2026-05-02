import { NextResponse } from "next/server";
import { z } from "zod";

import { parseStreamUrl } from "@/lib/embed-urls";
import { prisma } from "@/lib/prisma";

const add_stream_schema = z.object({
  playerLabel: z.string().min(1).max(80),
  sourceUrl: z.string().min(4).max(2048),
});

type RouteContext = { params: Promise<{ teamId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { teamId } = await context.params;
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return NextResponse.json({ error: "Time não encontrado" }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsed_body = add_stream_schema.safeParse(json);
  if (!parsed_body.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const parsed_url = parseStreamUrl(parsed_body.data.sourceUrl);
  if (parsed_url.kind === "INVALID") {
    return NextResponse.json({ error: parsed_url.message }, { status: 400 });
  }

  const platform =
    parsed_url.platform === "TWITCH" ? "TWITCH" : "YOUTUBE";

  const stream = await prisma.stream.create({
    data: {
      teamId,
      playerLabel: parsed_body.data.playerLabel.trim(),
      platform,
      sourceUrl: parsed_body.data.sourceUrl.trim(),
    },
  });

  return NextResponse.json({ stream });
}
