import { TeamCard } from "@/components/TeamCard";
import { useAppState } from "@/context/AppStateContext";

export function Home() {
  const { teams, hydrated } = useAppState();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">
        Carregando…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-400">
        Escolha um time para ver o mosaico de streams (Twitch / YouTube). Os dados ficam no seu navegador (
        <span className="text-slate-300">localStorage</span>) e você pode compartilhar o mesmo layout por um link que
        codifica tudo na URL — sem servidor.
      </p>
      {teams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
          <p className="text-slate-400">Nenhum time ainda.</p>
          <p className="mt-2 text-sm text-slate-500">
            Use <span className="text-violet-400">Novo time</span> para criar um grupo e colar URLs de canais.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
