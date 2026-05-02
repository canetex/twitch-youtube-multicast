"use client";

import { useCallback, useState } from "react";

type StreamRow = {
  id: string;
  playerLabel: string;
  platform: string;
  sourceUrl: string;
};

type TeamRow = {
  id: string;
  name: string;
  streams: StreamRow[];
};

export function CadastroForm({
  initial_share_url,
  initial_teams,
}: {
  initial_share_url: string;
  initial_teams: TeamRow[];
}) {
  const [teams, set_teams] = useState<TeamRow[]>(initial_teams);
  const [loading, set_loading] = useState(false);
  const [team_name, set_team_name] = useState("");
  const [selected_team_id, set_selected_team_id] = useState<string>(
    () => initial_teams[0]?.id ?? "",
  );
  const [player_label, set_player_label] = useState("");
  const [stream_url, set_stream_url] = useState("");
  const [error, set_error] = useState<string | null>(null);

  const reload = useCallback(async () => {
    set_loading(true);
    const res = await fetch("/api/teams");
    const data = (await res.json()) as { teams: TeamRow[] };
    set_teams(data.teams);
    set_selected_team_id((prev) => {
      if (prev && data.teams.some((t) => t.id === prev)) {
        return prev;
      }
      return data.teams[0]?.id ?? "";
    });
    set_loading(false);
  }, []);

  async function criar_time(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: team_name }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      set_error(body.error ?? "Erro ao criar time");
      return;
    }
    set_team_name("");
    await reload();
  }

  async function adicionar_stream(e: React.FormEvent) {
    e.preventDefault();
    set_error(null);
    if (!selected_team_id) {
      set_error("Selecione ou crie um time primeiro.");
      return;
    }
    const res = await fetch(`/api/teams/${selected_team_id}/streams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerLabel: player_label, sourceUrl: stream_url }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      set_error(body.error ?? "Erro ao adicionar stream");
      return;
    }
    set_player_label("");
    set_stream_url("");
    await reload();
  }

  async function remover_stream(stream_id: string) {
    set_error(null);
    await fetch(`/api/streams/${stream_id}`, { method: "DELETE" });
    await reload();
  }

  async function remover_team(team_id: string) {
    set_error(null);
    await fetch(`/api/teams/${team_id}`, { method: "DELETE" });
    await reload();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">1) Criar time</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Primeiro registre o nome do time; depois adicione cada jogador/stream.
          </p>
        </div>
        <form onSubmit={criar_time} className="flex flex-col gap-3">
          <label className="text-sm text-zinc-300">
            Nome do time
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-violet-500 focus:ring-2"
              value={team_name}
              onChange={(e) => set_team_name(e.target.value)}
              placeholder="Ex.: Los Galácticos"
              required
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Salvar time
          </button>
        </form>

        <div className="border-t border-zinc-800 pt-6">
          <h2 className="text-lg font-semibold text-white">2) Cadastrar Twitch / YouTube</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Cole o link do canal Twitch ou vídeo/live do YouTube de cada jogador.
          </p>
          <form onSubmit={adicionar_stream} className="mt-4 flex flex-col gap-3">
            <label className="text-sm text-zinc-300">
              Time
              <select
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-violet-500 focus:ring-2"
                value={selected_team_id}
                onChange={(e) => set_selected_team_id(e.target.value)}
                required
              >
                <option value="" disabled>
                  {loading ? "Carregando…" : "Selecione um time"}
                </option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-300">
              Jogador / apelido
              <input
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-violet-500 focus:ring-2"
                value={player_label}
                onChange={(e) => set_player_label(e.target.value)}
                placeholder="Ex.: Ana"
                required
              />
            </label>
            <label className="text-sm text-zinc-300">
              URL Twitch ou YouTube
              <input
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-violet-500 focus:ring-2"
                value={stream_url}
                onChange={(e) => set_stream_url(e.target.value)}
                placeholder="https://twitch.tv/nome ou https://youtube.com/watch?v=…"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Adicionar stream
            </button>
          </form>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Resumo</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Link para compartilhar todo o mosaico (copie também no topo da página):
          </p>
          <div className="mt-2 break-all rounded-lg bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-300">
            {initial_share_url}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">Carregando times…</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum time ainda.</p>
        ) : (
          <ul className="space-y-4">
            {teams.map((team) => (
              <li key={team.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white">{team.name}</div>
                    <div className="text-xs text-zinc-500">{team.id}</div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300"
                    onClick={() => void remover_team(team.id)}
                  >
                    Excluir time
                  </button>
                </div>
                <ul className="mt-3 space-y-2 border-t border-zinc-800 pt-3">
                  {team.streams.length === 0 ? (
                    <li className="text-sm text-zinc-500">Sem streams.</li>
                  ) : (
                    team.streams.map((s) => (
                      <li
                        key={s.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-sm"
                      >
                        <div>
                          <span className="text-zinc-200">{s.playerLabel}</span>
                          <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                            {s.platform}
                          </span>
                          <div className="break-all text-xs text-zinc-500">{s.sourceUrl}</div>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 text-xs text-red-400 hover:text-red-300"
                          onClick={() => void remover_stream(s.id)}
                        >
                          Remover
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
