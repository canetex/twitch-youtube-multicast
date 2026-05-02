import LZString from "lz-string";

import type { AppStateV1 } from "@/types";

/** Codifica o estado completo para uso em query (?s=) ou cópia manual. */
export function encode_state(state: AppStateV1): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

/** Decodifica payload gerado por encode_state. */
export function decode_state(encoded: string): AppStateV1 | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded.trim());
    if (!json) {
      return null;
    }
    const o = JSON.parse(json) as AppStateV1;
    if (o?.v !== 1 || !Array.isArray(o.teams)) {
      return null;
    }
    return o;
  } catch {
    return null;
  }
}

/** Lê ?s= da URL atual (antes do router hash). */
export function read_shared_state_from_search(): AppStateV1 | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const s = params.get("s");
  if (!s) {
    return null;
  }
  return decode_state(s);
}

/** Remove ?s= da barra de endereço sem recarregar. */
export function strip_share_param_from_address_bar(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("s");
  window.history.replaceState({}, "", url.pathname + url.hash + url.search);
}

/** Monta URL completa para compartilhar (mesmo mosaico sem servidor). */
export function build_shareable_page_url(state: AppStateV1): string {
  const encoded = encode_state(state);
  const url = new URL(window.location.href);
  url.searchParams.set("s", encoded);
  return url.toString();
}
