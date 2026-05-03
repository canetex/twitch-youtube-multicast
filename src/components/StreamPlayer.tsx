import { useEffect, useMemo, useState } from "react";

import { build_embed_src, parse_stream_url } from "@/utils/embedUrls";

type Props = {
  source_url: string;
  title: string;
  className?: string;
  /** Mosaico: mudo + autoplay; foco: tenta som */
  variant?: "tile" | "focus";
};

export function StreamPlayer({ source_url, title, className, variant = "tile" }: Props) {
  const [parent_host, set_parent_host] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      set_parent_host(window.location.hostname);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const parsed = useMemo(() => parse_stream_url(source_url), [source_url]);

  const src = useMemo(() => {
    if (!parent_host) {
      return null;
    }
    if (parsed.kind === "INVALID") {
      return null;
    }
    return build_embed_src(parsed, parent_host, {
      muted: variant === "tile",
      autoplay: true,
    });
  }, [parent_host, variant, parsed]);

  if (!parent_host) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-slate-900 ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  if (parsed.kind === "INVALID") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-amber-900/60 bg-slate-900/90 p-3 text-center text-xs text-amber-100/90 ${className ?? ""}`}
      >
        {parsed.message}
      </div>
    );
  }

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-slate-900 p-3 text-center text-xs text-slate-500 ${className ?? ""}`}
      >
        Não foi possível montar o player.
      </div>
    );
  }

  return (
    <iframe
      title={title}
      src={src}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}
