import type { AppStateV1 } from "@/types";

const STORAGE_KEY = "multicast-stream-viewer:v1";

export function load_state(): AppStateV1 | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const o = JSON.parse(raw) as AppStateV1;
    if (o?.v !== 1 || !Array.isArray(o.teams)) {
      return null;
    }
    return o;
  } catch {
    return null;
  }
}

export function save_state(state: AppStateV1): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
