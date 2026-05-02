import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Team } from "@/types";
import { load_state, save_state } from "@/utils/storage";
import { read_shared_state_from_search, strip_share_param_from_address_bar } from "@/utils/urlHandler";

type AppStateContextValue = {
  teams: Team[];
  hydrated: boolean;
  set_teams: React.Dispatch<React.SetStateAction<Team[]>>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [teams, set_teams] = useState<Team[]>([]);
  const [hydrated, set_hydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const from_url = read_shared_state_from_search();
      if (from_url) {
        set_teams(from_url.teams);
        save_state(from_url);
        strip_share_param_from_address_bar();
      } else {
        const saved = load_state();
        if (saved) {
          set_teams(saved.teams);
        }
      }
      set_hydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    save_state({ v: 1, teams });
  }, [teams, hydrated]);

  const value = useMemo(
    () => ({
      teams,
      hydrated,
      set_teams,
    }),
    [teams, hydrated],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState outside provider");
  }
  return ctx;
}

export function useTeam(team_id: string | undefined) {
  const { teams } = useAppState();
  return useMemo(() => teams.find((t) => t.id === team_id), [teams, team_id]);
}
