import { SiteHeader } from "@/components/site-header";
import { CadastroForm } from "@/app/cadastro/cadastro-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const teams_raw = await prisma.team.findMany({
    orderBy: { createdAt: "asc" },
    include: { streams: { orderBy: { createdAt: "asc" } } },
  });
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
      <SiteHeader copy_share={{ variant: "publish" }} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cadastro</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Crie o time e cadastre cada link de Twitch ou YouTube. No topo, use &quot;Copiar link do mosaico&quot; para
            gerar um URL que carrega <strong className="text-zinc-200">todos os times e streams</strong> cadastrados
            naquele momento (ideal para compartilhar o mosaico pré-configurado).
          </p>
        </div>
        <CadastroForm initial_teams={initial_teams} />
      </main>
    </div>
  );
}
