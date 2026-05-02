import { useNavigate, useParams } from "react-router-dom";

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
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-500">Time</p>
        <h1 className="text-2xl font-bold text-white">{team.name}</h1>
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
