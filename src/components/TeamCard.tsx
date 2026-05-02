import { Link } from "react-router-dom";

import type { Team } from "@/types";

export function TeamCard({ team }: { team: Team }) {
  const count = team.channels.length;

  return (
    <Link
      to={`/team/${team.id}`}
      className="block rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl ring-slate-800 transition hover:border-violet-500/40 hover:ring-2 hover:ring-violet-600/30"
    >
      <h2 className="text-lg font-semibold text-white">{team.name}</h2>
      <p className="mt-2 text-sm text-slate-500">
        {count === 0 ? "Sem canais" : `${count} canal(is)`}
      </p>
      <p className="mt-4 text-sm font-medium text-violet-400">Abrir mosaico →</p>
    </Link>
  );
}
