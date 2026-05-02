import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { StreamTile } from "@/components/stream-tile";
import { ensureBoardSettings } from "@/lib/board-settings";
import { get_site_base_url } from "@/lib/server-base-url";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ teamId: string }> };

export default async function EquipePage(props: PageProps) {
  const { teamId } = await props.params;
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });
  if (!team) {
    notFound();
  }

  const board = await ensureBoardSettings();
  const base = await get_site_base_url();
  const share_url = `${base}/compartilhar/${board.shareSlug}`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader share_url={share_url} show_back_home />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Time</p>
            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
          </div>
          <Link href="/cadastro" className="text-sm text-violet-400 hover:text-violet-300">
            Editar cadastro →
          </Link>
        </div>
        {team.streams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
            Este time ainda não tem streams.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.streams.map((stream) => (
              <StreamTile
                key={stream.id}
                team_id={team.id}
                stream_id={stream.id}
                player_label={stream.playerLabel}
                source_url={stream.sourceUrl}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
