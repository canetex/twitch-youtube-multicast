import type { ShareSnapshotPayloadV1 } from "@/lib/share-snapshot-payload";
import { prisma } from "@/lib/prisma";

export async function get_share_payload_by_token(
  token: string,
): Promise<ShareSnapshotPayloadV1 | null> {
  const row = await prisma.shareSnapshot.findUnique({ where: { token } });
  if (!row) {
    return null;
  }
  try {
    const parsed = JSON.parse(row.payload) as ShareSnapshotPayloadV1;
    if (parsed?.v !== 1 || !Array.isArray(parsed.teams)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
