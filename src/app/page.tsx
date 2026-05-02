import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import type { TeamSectionModel } from "@/components/team-section";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Todos os times</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Mosaico por time. Clique num time para ver só aquele grupo ou numa stream para focar em tela cheia. Use
            &quot;Copiar link do mosaico&quot; para gerar um URL com todos os times e streams cadastrados neste momento.
          </p>
        </div>
        {teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center text-zinc-400">
            <p className="mb-4">Nenhum time cadastrado ainda.</p>
            <a
              href="/cadastro"
              className="inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              Ir ao cadastro
            </a>
          </div>
        ) : (
          teams.map((team) => <TeamSection key={team.id} team={team} />)
        )}
      </main>
    </div>
  );
}
