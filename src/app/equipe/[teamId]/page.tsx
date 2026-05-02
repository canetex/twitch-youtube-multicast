import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { StreamTile } from "@/components/stream-tile";
import { get_site_base_url } from "@/lib/server-base-url";
import { prisma } from "@/lib/prisma";
import { get_share_payload_by_token } from "@/lib/share-snapshot-db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ snapshot?: string }>;
};

export default async function EquipePage(props: PageProps) {
  const { teamId } = await props.params;
  const sp = await props.searchParams;
  const snapshot_token = sp.snapshot;

  const prisma_team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });

  let team_name = "";
  let streams_list: {
    id: string;
    playerLabel: string;
    sourceUrl: string;
  }[] = [];

  if (prisma_team) {
    team_name = prisma_team.name;
    streams_list = prisma_team.streams.map((s) => ({
      id: s.id,
      playerLabel: s.playerLabel,
      sourceUrl: s.sourceUrl,
    }));
  } else if (snapshot_token) {
    const snap = await get_share_payload_by_token(snapshot_token);
    const t = snap?.teams.find((x) => x.id === teamId);
    if (t) {
      team_name = t.name;
      streams_list = t.streams.map((s) => ({
        id: s.id,
        playerLabel: s.playerLabel,
        sourceUrl: s.sourceUrl,
      }));
    }
  }

  if (!team_name) {
    notFound();
  }

  const base = await get_site_base_url();

  const copy_share = snapshot_token
    ? { variant: "url" as const, url: `${base}/compartilhar/mosaico/${snapshot_token}` }
    : { variant: "publish" as const };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader copy_share={copy_share} show_back_home />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Time</p>
            <h1 className="text-3xl font-bold text-white">{team_name}</h1>
          </div>
          <Link href="/cadastro" className="text-sm text-violet-400 hover:text-violet-300">
            Editar cadastro →
          </Link>
        </div>
        {streams_list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
            Este time ainda não tem streams.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {streams_list.map((stream) => (
              <StreamTile
                key={stream.id}
                team_id={teamId}
                stream_id={stream.id}
                player_label={stream.playerLabel}
                source_url={stream.sourceUrl}
                snapshot_token={snapshot_token}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
