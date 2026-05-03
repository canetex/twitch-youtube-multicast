import type { ChannelEntry } from "@/types";

import { StreamPlayer } from "@/components/StreamPlayer";

type Props = {
  channels: ChannelEntry[];
  on_pick_channel: (channel_id: string) => void;
};

function grid_cols_class(count: number): string {
  if (count <= 1) {
    return "grid-cols-1 max-w-5xl mx-auto";
  }
  if (count === 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }
  if (count <= 4) {
    return "grid-cols-1 sm:grid-cols-2";
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export function StreamGrid({ channels, on_pick_channel }: Props) {
  return (
    <div className={`grid gap-3 ${grid_cols_class(channels.length)}`}>
      {channels.map((ch) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => on_pick_channel(ch.id)}
          className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-left shadow-lg ring-slate-700 transition hover:border-violet-500/60 hover:ring-2"
        >
          <div className="relative aspect-video w-full">
            <StreamPlayer
              variant="tile"
              source_url={ch.url}
              title={ch.label}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="truncate text-sm font-semibold text-white">{ch.label}</p>
              <p className="text-xs text-slate-400">Clique para focar</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
