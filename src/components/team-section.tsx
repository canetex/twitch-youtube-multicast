import Link from "next/link";

import { StreamTile } from "@/components/stream-tile";

export type TeamSectionModel = {
  id: string;
  name: string;
  streams: { id: string; playerLabel: string; sourceUrl: string }[];
};

export function TeamSection({ team }: { team: TeamSectionModel }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">
          <Link href={`/equipe/${team.id}`} className="hover:text-violet-300">
            {team.name}
          </Link>
        </h2>
        <Link
          href={`/equipe/${team.id}`}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          Ver só este time →
        </Link>
      </div>
      {team.streams.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhuma stream cadastrada neste time.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {team.streams.map((stream) => (
            <StreamTile
              key={stream.id}
              team_id={team.id}
              stream_id={stream.id}
              player_label={stream.playerLabel}
              source_url={stream.sourceUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
