import { Link, useNavigate, useParams } from "react-router-dom";

import { StreamGrid } from "@/components/StreamGrid";
import { useTeam } from "@/context/AppStateContext";

export function TeamMosaic() {
  const { teamId } = useParams<{ teamId: string }>();
  const team = useTeam(teamId);
  const navigate = useNavigate();

  if (!team) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">
        Time não encontrado.
      </div>
    );
  }

  if (team.channels.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">
        Este time ainda não tem canais.{" "}
        <button
          type="button"
          className="text-violet-400 hover:underline"
          onClick={() => navigate(`/edit/${team.id}`)}
        >
          Adicionar canais
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Time</p>
          <h1 className="text-2xl font-bold text-white">{team.name}</h1>
        </div>
        <Link
          to={`/edit/${team.id}`}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
        >
          Editar time
        </Link>
      </div>
      <StreamGrid
        channels={team.channels}
        on_pick_channel={(channel_id) => {
          void navigate(`/team/${team.id}/focus/${channel_id}`);
        }}
      />
    </div>
  );
}
