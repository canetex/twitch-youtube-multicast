import { NextResponse } from "next/server";

import { ensureBoardSettings } from "@/lib/board-settings";

export async function GET(request: Request) {
  const board = await ensureBoardSettings();
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;
  return NextResponse.json({
    shareSlug: board.shareSlug,
    shareUrl: `${base}/compartilhar/${board.shareSlug}`,
  });
}
