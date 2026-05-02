import { nanoid } from "nanoid";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ChannelEntry, Team } from "@/types";
import { parse_stream_url } from "@/utils/embedUrls";
import { useAppState } from "@/context/AppStateContext";

function empty_channel(): ChannelEntry {
  return { id: nanoid(), label: "", url: "" };
}

export function TeamEditor() {
  const { teamId } = useParams<{ teamId: string }>();
  const { teams } = useAppState();
  const existing =
    teamId && teamId !== "new" ? teams.find((t) => t.id === teamId) : undefined;

  return <TeamEditorForm key={teamId} teamId={teamId ?? "new"} existing={existing} />;
}

function TeamEditorForm({
  teamId,
  existing,
}: {
  teamId: string;
  existing?: Team;
}) {
  const { set_teams } = useAppState();
  const navigate = useNavigate();

  const [name, set_name] = useState(() => existing?.name ?? "");
  const [channels, set_channels] = useState<ChannelEntry[]>(() =>
    existing?.channels?.length ? existing.channels : [empty_channel()],
  );
  const [error, set_error] = useState<string | null>(null);

  function validate_channels(list: ChannelEntry[]): string | null {
    for (const ch of list) {
      if (!ch.url.trim()) {
        continue;
      }
      const p = parse_stream_url(ch.url);
      if (p.kind === "INVALID") {
        return p.message;
      }
    }
    return null;
  }

  function save() {
    set_error(null);
    const trimmed_name = name.trim();
    if (!trimmed_name) {
      set_error("Informe o nome do time.");
      return;
    }

    const filtered = channels.filter((c) => c.url.trim() !== "");
    const labels_ok = filtered.every((c) => c.label.trim() !== "");
    if (filtered.length > 0 && !labels_ok) {
      set_error("Cada canal com URL precisa de um nome.");
      return;
    }

    const err = validate_channels(filtered);
    if (err) {
      set_error(err);
      return;
    }

    if (teamId === "new") {
      const id = nanoid();
      const team: Team = { id, name: trimmed_name, channels: filtered };
      set_teams((prev) => [...prev, team]);
      void navigate(`/team/${id}`);
      return;
    }

    if (!existing) {
      set_error("Time não encontrado.");
      return;
    }

    const updated: Team = { ...existing, name: trimmed_name, channels: filtered };
    set_teams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    void navigate(`/team/${updated.id}`);
  }

  function remove_team() {
    if (!existing || teamId === "new") {
      return;
    }
    set_teams((prev) => prev.filter((t) => t.id !== existing.id));
    void navigate("/");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">
        {teamId === "new" ? "Novo time" : "Editar time"}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Cole URLs da Twitch ou YouTube; a plataforma é detectada automaticamente.
      </p>

      <label className="mt-8 block text-sm text-slate-300">
        Nome do grupo
        <input
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-violet-500 focus:ring-2"
          value={name}
          onChange={(e) => set_name(e.target.value)}
          placeholder="Ex.: Pro Players"
        />
      </label>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Canais</span>
          <button
            type="button"
            className="text-sm text-violet-400 hover:text-violet-300"
            onClick={() => set_channels((c) => [...c, empty_channel()])}
          >
            + Adicionar linha
          </button>
        </div>
        {channels.map((ch, idx) => (
          <div key={ch.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <label className="block text-xs text-slate-500">
              Nome do jogador / rótulo
              <input
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white"
                value={ch.label}
                onChange={(e) => {
                  const v = e.target.value;
                  set_channels((prev) =>
                    prev.map((row, i) => (i === idx ? { ...row, label: v } : row)),
                  );
                }}
              />
            </label>
            <label className="mt-3 block text-xs text-slate-500">
              URL Twitch ou YouTube
              <input
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5 font-mono text-sm text-white"
                value={ch.url}
                onChange={(e) => {
                  const v = e.target.value;
                  set_channels((prev) =>
                    prev.map((row, i) => (i === idx ? { ...row, url: v } : row)),
                  );
                }}
                placeholder="https://twitch.tv/… ou https://youtube.com/watch?v=…"
              />
            </label>
            <button
              type="button"
              className="mt-2 text-xs text-red-400 hover:text-red-300"
              onClick={() => set_channels((prev) => prev.filter((_, i) => i !== idx))}
            >
              Remover linha
            </button>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          onClick={() => save()}
        >
          Salvar
        </button>
        {existing ? (
          <button
            type="button"
            className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
            onClick={() => remove_team()}
          >
            Excluir time
          </button>
        ) : null}
      </div>
    </div>
  );
}
