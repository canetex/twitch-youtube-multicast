"use client";

import { useState } from "react";

export type CopyShareProps =
  | { variant: "publish" }
  | { variant: "url"; url: string };

export function CopyShareButton(props: CopyShareProps) {
  const [label, set_label] = useState("Copiar link do mosaico");

  return (
    <button
      type="button"
      className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
      onClick={() => {
        void (async () => {
          try {
            let target_url = "";
            if (props.variant === "url") {
              target_url = props.url;
            } else {
              const res = await fetch("/api/share/publish", { method: "POST" });
              if (!res.ok) {
                set_label("Erro ao gerar link");
                setTimeout(() => set_label("Copiar link do mosaico"), 2500);
                return;
              }
              const data = (await res.json()) as { url?: string };
              if (!data.url) {
                set_label("Erro ao gerar link");
                setTimeout(() => set_label("Copiar link do mosaico"), 2500);
                return;
              }
              target_url = data.url;
            }
            await navigator.clipboard.writeText(target_url);
            set_label("Copiado!");
            setTimeout(() => set_label("Copiar link do mosaico"), 2000);
          } catch {
            set_label("Erro ao copiar");
            setTimeout(() => set_label("Copiar link do mosaico"), 2500);
          }
        })();
      }}
    >
      {label}
    </button>
  );
}
