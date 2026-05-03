import { Link } from "react-router-dom";

import type { Team } from "@/types";
import { useAppState } from "@/context/AppStateContext";

export function TeamCard({ team }: { team: Team }) {
  const count = team.channels.length;
  const { set_teams } = useAppState();

  function excluir(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Excluir o time "${team.name}"?`)) {
      return;
    }
    set_teams((lista) => lista.filter((t) => t.id !== team.id));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl ring-slate-800 transition hover:border-violet-500/40 hover:ring-2 hover:ring-violet-600/30">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link to={`/team/${team.id}`} className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-white">{team.name}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {count === 0 ? "Sem canais" : `${count} canal(is)`}
          </p>
          <p className="mt-4 text-sm font-medium text-violet-400">Abrir mosaico →</p>
        </Link>
        <div className="flex shrink-0 gap-2">
          <Link
            to={`/edit/${team.id}`}
            className="rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            Editar
          </Link>
          <button
            type="button"
            className="rounded-lg border border-red-900/60 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-950/70"
            onClick={excluir}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
