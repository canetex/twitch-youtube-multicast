import { Link, useLocation } from "react-router-dom";

import type { AppStateV1 } from "@/types";
import { build_shareable_page_url } from "@/utils/urlHandler";

type Props = {
  title?: string;
  /** Estado atual para gerar link completo na URL */
  share_state: AppStateV1 | null;
};

export function Header({ title, share_state }: Props) {
  const location = useLocation();
  const is_home = location.pathname === "/";

  async function copy_share_link() {
    if (!share_state) {
      return;
    }
    try {
      await navigator.clipboard.writeText(build_shareable_page_url(share_state));
    } catch {
      /* noop */
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          {!is_home ? (
            <Link
              to="/"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-100 hover:bg-slate-800"
            >
              Voltar ao início
            </Link>
          ) : null}
          <span className="text-lg font-semibold tracking-tight text-white">
            {title ?? "Multicast Stream Viewer"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/edit/new"
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
          >
            {is_home ? "Novo time" : "Gerenciar"}
          </Link>
          {share_state && share_state.teams.length > 0 ? (
            <button
              type="button"
              onClick={() => void copy_share_link()}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
            >
              Copiar link (URL)
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
