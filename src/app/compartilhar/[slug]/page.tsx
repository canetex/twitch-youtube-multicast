import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import type { TeamSectionModel } from "@/components/team-section";
import { ensureBoardSettings } from "@/lib/board-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function SharePage(props: PageProps) {
  const { slug } = await props.params;
  const board = await ensureBoardSettings();
  if (board.shareSlug !== slug) {
    notFound();
  }

  const teams_raw = await prisma.team.findMany({
    orderBy: { createdAt: "asc" },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });

  const teams: TeamSectionModel[] = teams_raw.map((t) => ({
    id: t.id,
    name: t.name,
    streams: t.streams.map((s) => ({
      id: s.id,
      playerLabel: s.playerLabel,
      sourceUrl: s.sourceUrl,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader copy_share={{ variant: "publish" }} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Multicast (slug)</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Vista ao vivo do cadastro. Para um link que congela o mosaico atual em uma única página compartilhável, use
            &quot;Copiar link do mosaico&quot;.
          </p>
        </div>
        {teams.length === 0 ? (
          <p className="text-zinc-500">Nenhum time cadastrado.</p>
        ) : (
          teams.map((team) => <TeamSection key={team.id} team={team} />)
        )}
      </main>
    </div>
  );
}
