import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { build_share_payload_from_db } from "@/lib/build-share-payload";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await build_share_payload_from_db();
  const token = nanoid(16);
  await prisma.shareSnapshot.create({
    data: {
      token,
      payload: JSON.stringify(payload),
    },
  });

  const url_obj = new URL(request.url);
  const base = `${url_obj.protocol}//${url_obj.host}`;
  const share_url = `${base}/compartilhar/mosaico/${token}`;

  return NextResponse.json({ token, url: share_url });
}
