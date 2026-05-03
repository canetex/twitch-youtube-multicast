export type EmbedKind =
  | "TWITCH_CHANNEL"
  | "TWITCH_VOD"
  | "YOUTUBE_VIDEO"
  | "YOUTUBE_LIVE_CHANNEL";

export type ParsedEmbed =
  | { kind: "TWITCH_CHANNEL"; platform: "TWITCH"; channel: string }
  | { kind: "TWITCH_VOD"; platform: "TWITCH"; videoId: string }
  | { kind: "YOUTUBE_VIDEO"; platform: "YOUTUBE"; videoId: string }
  | { kind: "YOUTUBE_LIVE_CHANNEL"; platform: "YOUTUBE"; channelId: string }
  | { kind: "INVALID"; platform: "UNKNOWN"; message: string };

export function parse_stream_url(raw: string): ParsedEmbed {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { kind: "INVALID", platform: "UNKNOWN", message: "URL vazia" };
  }

  let url_string = trimmed;
  if (!/^https?:\/\//i.test(url_string)) {
    url_string = `https://${url_string}`;
  }

  let u: URL;
  try {
    u = new URL(url_string);
  } catch {
    return { kind: "INVALID", platform: "UNKNOWN", message: "URL inválida" };
  }

  const host = u.hostname.replace(/^www\./i, "").toLowerCase();

  if (host === "twitch.tv" || host.endsWith(".twitch.tv")) {
    return parse_twitch_path(u);
  }

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be" ||
    host === "music.youtube.com"
  ) {
    return parse_youtube_url(u);
  }

  return { kind: "INVALID", platform: "UNKNOWN", message: "Somente Twitch ou YouTube" };
}

function parse_twitch_path(u: URL): ParsedEmbed {
  const segments = u.pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { kind: "INVALID", platform: "UNKNOWN", message: "Canal Twitch não encontrado" };
  }

  if (segments[0] === "videos" && segments[1] && /^\d+$/.test(segments[1])) {
    return { kind: "TWITCH_VOD", platform: "TWITCH", videoId: segments[1] };
  }

  const channel = segments[0].toLowerCase();
  if (!/^[a-z0-9_-]{2,25}$/i.test(channel)) {
    return { kind: "INVALID", platform: "UNKNOWN", message: "Nome de canal Twitch inválido" };
  }

  return { kind: "TWITCH_CHANNEL", platform: "TWITCH", channel };
}

function parse_youtube_url(u: URL): ParsedEmbed {
  const v_param = u.searchParams.get("v");
  if (v_param && /^[\w-]{6,}$/.test(v_param)) {
    return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: v_param };
  }

  const shorts_match = u.pathname.match(/^\/shorts\/([\w-]{6,})/);
  if (shorts_match) {
    return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: shorts_match[1] };
  }

  if (u.hostname.replace(/^www\./i, "").toLowerCase() === "youtu.be") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    if (id && /^[\w-]{6,}$/.test(id)) {
      return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: id };
    }
  }

  const embed_match = u.pathname.match(/^\/embed\/([\w-]+)/);
  if (embed_match && /^[\w-]{6,}$/.test(embed_match[1])) {
    return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: embed_match[1] };
  }

  const channel_match = u.pathname.match(/^\/channel\/([\w-]+)/);
  if (channel_match && channel_match[1].startsWith("UC") && channel_match[1].length >= 10) {
    return {
      kind: "YOUTUBE_LIVE_CHANNEL",
      platform: "YOUTUBE",
      channelId: channel_match[1],
    };
  }

  const live_match = u.pathname.match(/^\/live\/([\w-]+)/);
  if (live_match && /^[\w-]{6,}$/.test(live_match[1])) {
    return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: live_match[1] };
  }

  return {
    kind: "INVALID",
    platform: "UNKNOWN",
    message: "Use watch?v=…, youtu.be ou canal /channel/UC…",
  };
}

/** Domínios extras aceitos pelo player Twitch (localhost vs 127.0.0.1). */
export function twitch_parent_query(primary_host: string): string {
  const hosts = new Set<string>([primary_host]);
  if (primary_host === "localhost") {
    hosts.add("127.0.0.1");
  }
  if (primary_host === "127.0.0.1") {
    hosts.add("localhost");
  }
  return [...hosts].map((h) => `parent=${encodeURIComponent(h)}`).join("&");
}

export function build_embed_src(
  parsed: ParsedEmbed,
  parent_hostname: string,
  opts?: { muted?: boolean; autoplay?: boolean },
): string | null {
  const muted =
    opts?.muted === true ? true : opts?.muted === false ? false : undefined;
  const autoplay = opts?.autoplay === true;

  switch (parsed.kind) {
    case "TWITCH_CHANNEL": {
      const parents_q = twitch_parent_query(parent_hostname);
      const muted_q =
        muted === true ? "&muted=true" : muted === false ? "&muted=false" : "&muted=false";
      const autoplay_q = autoplay ? "&autoplay=true" : "";
      return `https://player.twitch.tv/?channel=${encodeURIComponent(parsed.channel)}&${parents_q}${muted_q}${autoplay_q}`;
    }
    case "TWITCH_VOD": {
      const parents_q = twitch_parent_query(parent_hostname);
      const muted_q =
        muted === true ? "&muted=true" : muted === false ? "&muted=false" : "&muted=true";
      const autoplay_q = autoplay ? "&autoplay=true" : "";
      return `https://player.twitch.tv/?video=${encodeURIComponent(parsed.videoId)}&${parents_q}${muted_q}${autoplay_q}`;
    }
    case "YOUTUBE_VIDEO": {
      const mute_q = muted === true ? 1 : muted === false ? 0 : 1;
      const auto_q = autoplay ? 1 : 0;
      return `https://www.youtube.com/embed/${encodeURIComponent(parsed.videoId)}?rel=0&autoplay=${auto_q}&mute=${mute_q}`;
    }
    case "YOUTUBE_LIVE_CHANNEL": {
      const mute_q = muted === true ? 1 : muted === false ? 0 : 1;
      const auto_q = autoplay ? 1 : 0;
      return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(parsed.channelId)}&autoplay=${auto_q}&mute=${mute_q}`;
    }
    default:
      return null;
  }
}
