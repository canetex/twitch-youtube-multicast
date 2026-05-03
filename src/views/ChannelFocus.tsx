import type { CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { StreamPlayer } from "@/components/StreamPlayer";
import { useTeam } from "@/context/AppStateContext";

/** Área útil abaixo do header (~3.5rem) e acima da faixa de miniaturas (~5.5rem). */
const FOCUS_STYLE: CSSProperties = {
  aspectRatio: "16 / 9",
  /* Largura limitada pela viewport e pela altura disponível (16:9). */
  width: "min(calc(100vw - 16px), calc((100dvh - 9rem) * 16 / 9))",
  maxWidth: "calc(100vw - 16px)",
  maxHeight: "calc(100dvh - 9rem)",
  marginLeft: "auto",
  marginRight: "auto",
};

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
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col bg-black">
      {/* Coluna full-width evita flex-row encolher o player ao tamanho do conteúdo */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-2 pb-28 pt-2">
        <div className="relative w-full shrink-0" style={FOCUS_STYLE}>
          <StreamPlayer
            variant="focus"
            source_url={channel.url}
            title={channel.label}
            className="absolute inset-0 z-0 h-full w-full rounded-sm border-0"
          />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-black/65 px-2.5 py-1.5 text-sm text-white backdrop-blur-sm">
          <div className="font-semibold leading-tight">{team.name}</div>
          <div className="text-xs leading-tight text-slate-300">{channel.label}</div>
        </div>

        <button
          type="button"
          className="pointer-events-auto absolute right-3 top-3 z-10 rounded-md border border-white/20 bg-black/45 px-2 py-1 text-xs text-white backdrop-blur-sm hover:bg-black/65"
          onClick={() => void navigate(`/team/${team.id}`)}
        >
          Mosaico
        </button>

        {others.length > 0 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-2 pt-12">
            <span className="pointer-events-none mb-1 text-[10px] font-medium uppercase tracking-wide text-white/70 drop-shadow-md">
              Outros canais
            </span>
            <div className="pointer-events-auto flex max-w-full gap-1.5 overflow-x-auto px-2 pb-1 sm:gap-2">
              {others.map((stream) => (
                <Link
                  key={stream.id}
                  to={`/team/${team.id}/focus/${stream.id}`}
                  className="w-[72px] shrink-0 overflow-hidden rounded-md shadow-lg shadow-black/50 ring-1 ring-white/25 transition hover:ring-violet-400 sm:w-24"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <StreamPlayer
                      variant="tile"
                      source_url={stream.url}
                      title={stream.label}
                      className="pointer-events-none absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                  <div className="max-w-[72px] truncate px-0.5 py-0.5 text-center text-[9px] leading-none text-white drop-shadow-md sm:max-w-24 sm:text-[10px]">
                    {stream.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
