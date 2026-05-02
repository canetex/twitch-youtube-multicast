import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { WatchExperience } from "@/components/watch-experience";
import { ensureBoardSettings } from "@/lib/board-settings";
import { get_site_base_url } from "@/lib/server-base-url";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ teamId: string; streamId: string }> };

export default async function VerStreamPage(props: PageProps) {
  const { teamId, streamId } = await props.params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });
  if (!team) {
    notFound();
  }

  const stream_ok = team.streams.some((s) => s.id === streamId);
  if (!stream_ok) {
    notFound();
  }

  const board = await ensureBoardSettings();
  const base = await get_site_base_url();
  const share_url = `${base}/compartilhar/${board.shareSlug}`;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader share_url={share_url} show_back_home />
      <WatchExperience
        team_id={team.id}
        team_name={team.name}
        active_stream_id={streamId}
        streams={team.streams.map((s) => ({
          id: s.id,
          playerLabel: s.playerLabel,
          sourceUrl: s.sourceUrl,
        }))}
      />
    </div>
  );
}
