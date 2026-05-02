"use client";

import { useState } from "react";

export function CopyShareButton({ url }: { url: string }) {
  const [label, set_label] = useState("Copiar link público");

  return (
    <button
      type="button"
      className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
      onClick={() => {
        void navigator.clipboard.writeText(url).then(() => {
          set_label("Copiado!");
          setTimeout(() => set_label("Copiar link público"), 2000);
        });
      }}
    >
      {label}
    </button>
  );
}
