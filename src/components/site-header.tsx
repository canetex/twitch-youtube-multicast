import Link from "next/link";

import { CopyShareButton } from "@/components/copy-share-button";
import type { CopyShareProps } from "@/components/copy-share-button";

export function SiteHeader({
  copy_share,
  show_back_home,
}: {
  copy_share?: CopyShareProps | null;
  show_back_home?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Twitch e Youtube Multicast
          </Link>
          <nav className="flex gap-3 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              Início
            </Link>
            <Link href="/cadastro" className="hover:text-white">
              Cadastro
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {show_back_home ? (
            <Link
              href="/"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-800"
            >
              Voltar aos times
            </Link>
          ) : null}
          {copy_share ? <CopyShareButton {...copy_share} /> : null}
        </div>
      </div>
    </header>
  );
}
