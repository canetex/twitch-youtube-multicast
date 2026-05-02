import { Link, useNavigate, useParams } from "react-router-dom";

import { StreamPlayer } from "@/components/StreamPlayer";
import { useTeam } from "@/context/AppStateContext";

export function ChannelFocus() {
  const { teamId, channelId } = useParams<{ teamId: string; channelId: string }>();
  const team = useTeam(teamId);
  const navigate = useNavigate();

  if (!team) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">
        Time não encontrado.
      </div>
    );
  }

  const channel = team.channels.find((c) => c.id === channelId);
  if (!channel) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">
        Canal não encontrado.
      </div>
    );
  }

  const others = team.channels.filter((c) => c.id !== channel.id);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-black">
      <div className="relative flex min-h-[78vh] flex-1 items-center justify-center bg-black">
        <StreamPlayer
          variant="focus"
          source_url={channel.url}
          title={channel.label}
          className="h-full w-full max-h-[78vh] max-w-[100vw]"
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-black/70 px-3 py-2 text-sm text-white backdrop-blur">
          <div className="font-semibold">{team.name}</div>
          <div className="text-slate-300">{channel.label}</div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 px-3 py-3">
        <div className="mx-auto flex max-w-6xl flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Outros canais</span>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
              onClick={() => void navigate(`/team/${team.id}`)}
            >
              Mosaico do time
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {others.length === 0 ? (
              <span className="text-sm text-slate-500">Nenhum outro canal.</span>
            ) : (
              others.map((stream) => (
                <Link
                  key={stream.id}
                  to={`/team/${team.id}/focus/${stream.id}`}
                  className="w-44 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-black hover:border-violet-600"
                >
                  <div className="relative aspect-video w-full">
                    <StreamPlayer
                      variant="tile"
                      source_url={stream.url}
                      title={stream.label}
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </div>
                  <div className="truncate px-2 py-1 text-xs text-slate-200">{stream.label}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
