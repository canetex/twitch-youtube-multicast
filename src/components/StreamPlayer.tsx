import { useEffect, useMemo, useState } from "react";

import { build_embed_src, parse_stream_url } from "@/utils/embedUrls";

type Props = {
  source_url: string;
  title: string;
  className?: string;
  /** Mosaico: áudio reduzido para não sobrepor vários players */
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

  const src = useMemo(() => {
    if (!parent_host) {
      return null;
    }
    const parsed = parse_stream_url(source_url);
    return build_embed_src(parsed, parent_host, {
      muted: variant === "tile",
    });
  }, [source_url, parent_host, variant]);

  if (!src) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-slate-900 ${className ?? ""}`}
        aria-hidden
      />
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
