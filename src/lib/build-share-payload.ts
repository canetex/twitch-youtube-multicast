import type { ShareSnapshotPayloadV1 } from "@/lib/share-snapshot-payload";
import { prisma } from "@/lib/prisma";

export async function build_share_payload_from_db(): Promise<ShareSnapshotPayloadV1> {
  const teams = await prisma.team.findMany({
    orderBy: { createdAt: "asc" },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });

  return {
    v: 1,
    teams: teams.map((t) => ({
      id: t.id,
      name: t.name,
      streams: t.streams.map((s) => ({
        id: s.id,
        playerLabel: s.playerLabel,
        sourceUrl: s.sourceUrl,
        platform: s.platform,
      })),
    })),
  };
}
