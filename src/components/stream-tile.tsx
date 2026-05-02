import Link from "next/link";

import { StreamIframe } from "@/components/stream-iframe";

export function StreamTile({
  team_id,
  stream_id,
  player_label,
  source_url,
}: {
  team_id: string;
  stream_id: string;
  player_label: string;
  source_url: string;
}) {
  const href = `/ver/${team_id}/${stream_id}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg">
      <div className="relative aspect-video w-full">
        <StreamIframe
          variant="tile"
          source_url={source_url}
          title={player_label}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <Link
          href={href}
          className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3 text-left outline-none ring-violet-500 focus-visible:ring-2"
          aria-label={`Abrir tela cheia: ${player_label}`}
        >
          <span className="text-sm font-semibold text-white drop-shadow">{player_label}</span>
          <span className="text-xs text-zinc-300">Clique para focar</span>
        </Link>
      </div>
    </div>
  );
}
