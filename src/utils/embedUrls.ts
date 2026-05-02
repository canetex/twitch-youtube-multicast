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
  if (!/^[a-z0-9_]{3,25}$/i.test(channel)) {
    return { kind: "INVALID", platform: "UNKNOWN", message: "Nome de canal Twitch inválido" };
  }

  return { kind: "TWITCH_CHANNEL", platform: "TWITCH", channel };
}

function parse_youtube_url(u: URL): ParsedEmbed {
  const v_param = u.searchParams.get("v");
  if (v_param && /^[\w-]{6,}$/.test(v_param)) {
    return { kind: "YOUTUBE_VIDEO", platform: "YOUTUBE", videoId: v_param };
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

export function build_embed_src(
  parsed: ParsedEmbed,
  parent_hostname: string,
  opts?: { muted?: boolean },
): string | null {
  const muted_extra =
    opts?.muted === true ? "&muted=true" : opts?.muted === false ? "&muted=false" : "";

  switch (parsed.kind) {
    case "TWITCH_CHANNEL":
      return `https://player.twitch.tv/?channel=${encodeURIComponent(parsed.channel)}&parent=${encodeURIComponent(parent_hostname)}${muted_extra || "&muted=false"}`;
    case "TWITCH_VOD":
      return `https://player.twitch.tv/?video=${encodeURIComponent(parsed.videoId)}&parent=${encodeURIComponent(parent_hostname)}${muted_extra}`;
    case "YOUTUBE_VIDEO":
      return `https://www.youtube.com/embed/${encodeURIComponent(parsed.videoId)}?rel=0`;
    case "YOUTUBE_LIVE_CHANNEL":
      return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(parsed.channelId)}`;
    default:
      return null;
  }
}
