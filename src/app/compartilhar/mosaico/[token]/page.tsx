import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import type { TeamSectionModel } from "@/components/team-section";
import { get_site_base_url } from "@/lib/server-base-url";
import { get_share_payload_by_token } from "@/lib/share-snapshot-db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export default async function MosaicoPublicadoPage(props: PageProps) {
  const { token } = await props.params;
  const data = await get_share_payload_by_token(token);
  if (!data) {
    notFound();
  }

  const base = await get_site_base_url();
  const share_page_url = `${base}/compartilhar/mosaico/${token}`;

  const teams: TeamSectionModel[] = data.teams.map((t) => ({
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
      <SiteHeader copy_share={{ variant: "url", url: share_page_url }} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mosaico compartilhado</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Todas as streams e times incluídos neste link. Use &quot;Copiar link do mosaico&quot; para enviar a mesma
            página.
          </p>
        </div>
        {teams.length === 0 ? (
          <p className="text-zinc-500">Nenhum time neste mosaico.</p>
        ) : (
          teams.map((team) => <TeamSection key={team.id} team={team} share_token={token} />)
        )}
      </main>
    </div>
  );
}
