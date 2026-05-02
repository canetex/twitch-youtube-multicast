import { SiteHeader } from "@/components/site-header";
import { CadastroForm } from "@/app/cadastro/cadastro-form";
import { ensureBoardSettings } from "@/lib/board-settings";
import { get_site_base_url } from "@/lib/server-base-url";
import { prisma } from "@/lib/prisma";

export default async function CadastroPage() {
  const [board, base, teams_raw] = await Promise.all([
    ensureBoardSettings(),
    get_site_base_url(),
    prisma.team.findMany({
      orderBy: { createdAt: "asc" },
      include: { streams: { orderBy: { createdAt: "asc" } } },
    }),
  ]);
  const share_url = `${base}/compartilhar/${board.shareSlug}`;
  const initial_teams = teams_raw.map((t) => ({
    id: t.id,
    name: t.name,
    streams: t.streams.map((s) => ({
      id: s.id,
      playerLabel: s.playerLabel,
      platform: s.platform,
      sourceUrl: s.sourceUrl,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader share_url={share_url} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cadastro</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Crie o time e, em seguida, cadastre cada link de Twitch ou YouTube dos jogadores. O início mostra o mosaico
            com todos os times; você pode copiar o link público para espectadores.
          </p>
        </div>
        <CadastroForm initial_share_url={share_url} initial_teams={initial_teams} />
      </main>
    </div>
  );
}
