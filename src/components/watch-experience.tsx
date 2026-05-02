"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StreamIframe } from "@/components/stream-iframe";

export type WatchStream = {
  id: string;
  playerLabel: string;
  sourceUrl: string;
};

export function WatchExperience({
  team_id,
  team_name,
  active_stream_id,
  streams,
}: {
  team_id: string;
  team_name: string;
  active_stream_id: string;
  streams: WatchStream[];
}) {
  const router = useRouter();
  const active =
    streams.find((s) => s.id === active_stream_id) ?? streams[0] ?? null;

  if (!active) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center text-zinc-400">
        <p>Nenhuma stream neste time.</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const others = streams.filter((s) => s.id !== active.id);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-black">
      <div className="relative flex flex-1 items-center justify-center bg-black">
        <StreamIframe
          variant="focus"
          source_url={active.sourceUrl}
          title={active.playerLabel}
          className="h-full w-full max-h-[calc(100vh-180px)] max-w-[100vw]"
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-black/60 px-3 py-2 text-sm text-white backdrop-blur">
          <div className="font-semibold">{team_name}</div>
          <div className="text-zinc-300">{active.playerLabel}</div>
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950 px-3 py-3">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Outras streams do time
            </span>
            <button
              type="button"
              className="rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
              onClick={() => router.push(`/equipe/${team_id}`)}
            >
              Mosaico do time
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {others.length === 0 ? (
              <span className="text-sm text-zinc-500">Sem outras streams.</span>
            ) : (
              others.map((stream) => (
                <Link
                  key={stream.id}
                  href={`/ver/${team_id}/${stream.id}`}
                  className="w-44 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-black hover:border-violet-600"
                >
                  <div className="relative aspect-video w-full">
                    <StreamIframe
                      variant="tile"
                      source_url={stream.sourceUrl}
                      title={stream.playerLabel}
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    />
                  </div>
                  <div className="truncate px-2 py-1 text-xs text-zinc-200">{stream.playerLabel}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
