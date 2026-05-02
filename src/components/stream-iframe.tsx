"use client";

import { useEffect, useMemo, useState } from "react";

import { buildEmbedSrc, parseStreamUrl } from "@/lib/embed-urls";

export function StreamIframe({
  source_url,
  title,
  className,
  variant = "tile",
}: {
  source_url: string;
  title: string;
  className?: string;
  variant?: "tile" | "focus";
}) {
  const [parent_host, set_parent_host] = useState("");

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) {
        set_parent_host(window.location.hostname);
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  const src = useMemo(() => {
    if (!parent_host) {
      return null;
    }
    const parsed = parseStreamUrl(source_url);
    return buildEmbedSrc(parsed, parent_host, {
      muted: variant === "tile",
    });
  }, [source_url, parent_host, variant]);

  if (!src) {
    return <div className={`animate-pulse rounded-lg bg-zinc-900 ${className ?? ""}`} aria-hidden />;
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
