import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { WatchExperience } from "@/components/watch-experience";
import { get_site_base_url } from "@/lib/server-base-url";
import { prisma } from "@/lib/prisma";
import { get_share_payload_by_token } from "@/lib/share-snapshot-db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ teamId: string; streamId: string }>;
  searchParams: Promise<{ snapshot?: string }>;
};

export default async function VerStreamPage(props: PageProps) {
  const { teamId, streamId } = await props.params;
  const sp = await props.searchParams;
  const snapshot_token = sp.snapshot;

  const prisma_team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });

  let team_name = "";
  let streams_payload: { id: string; playerLabel: string; sourceUrl: string }[] = [];

  if (prisma_team) {
    team_name = prisma_team.name;
    streams_payload = prisma_team.streams.map((s) => ({
      id: s.id,
      playerLabel: s.playerLabel,
      sourceUrl: s.sourceUrl,
    }));
  } else if (snapshot_token) {
    const snap = await get_share_payload_by_token(snapshot_token);
    const t = snap?.teams.find((x) => x.id === teamId);
    if (t && t.streams.some((s) => s.id === streamId)) {
      team_name = t.name;
      streams_payload = t.streams.map((s) => ({
        id: s.id,
        playerLabel: s.playerLabel,
        sourceUrl: s.sourceUrl,
      }));
    }
  }

  if (!team_name || streams_payload.length === 0) {
    notFound();
  }

  const stream_ok = streams_payload.some((s) => s.id === streamId);
  if (!stream_ok) {
    notFound();
  }

  const base = await get_site_base_url();

  const copy_share = snapshot_token
    ? { variant: "url" as const, url: `${base}/compartilhar/mosaico/${snapshot_token}` }
    : { variant: "publish" as const };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader copy_share={copy_share} show_back_home />
      <WatchExperience
        team_id={teamId}
        team_name={team_name}
        active_stream_id={streamId}
        streams={streams_payload}
        snapshot_token={snapshot_token}
      />
    </div>
  );
}
