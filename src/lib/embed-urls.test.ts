import { describe, expect, it } from "vitest";

import { buildEmbedSrc, parseStreamUrl } from "@/lib/embed-urls";

describe("parseStreamUrl", () => {
  it("extrai canal Twitch", () => {
    const r = parseStreamUrl("https://www.twitch.tv/shroud");
    expect(r.kind).toBe("TWITCH_CHANNEL");
    if (r.kind === "TWITCH_CHANNEL") {
      expect(r.channel).toBe("shroud");
    }
  });

  it("extrai VOD Twitch", () => {
    const r = parseStreamUrl("twitch.tv/videos/123456789");
    expect(r.kind).toBe("TWITCH_VOD");
    if (r.kind === "TWITCH_VOD") {
      expect(r.videoId).toBe("123456789");
    }
  });

  it("extrai vídeo YouTube watch", () => {
    const r = parseStreamUrl("https://youtube.com/watch?v=dQw4w9WgXcQ");
    expect(r.kind).toBe("YOUTUBE_VIDEO");
    if (r.kind === "YOUTUBE_VIDEO") {
      expect(r.videoId).toBe("dQw4w9WgXcQ");
    }
  });

  it("extrai youtu.be", () => {
    const r = parseStreamUrl("youtu.be/dQw4w9WgXcQ");
    expect(r.kind).toBe("YOUTUBE_VIDEO");
  });

  it("extrai canal YouTube para live embed", () => {
    const r = parseStreamUrl("https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx");
    expect(r.kind).toBe("YOUTUBE_LIVE_CHANNEL");
  });
});

describe("buildEmbedSrc", () => {
  it("monta iframe Twitch com parent", () => {
    const p = parseStreamUrl("twitch.tv/shroud");
    if (p.kind !== "TWITCH_CHANNEL") {
      throw new Error("parse");
    }
    const src = buildEmbedSrc(p, "localhost");
    expect(src).toContain("player.twitch.tv");
    expect(src).toContain("parent=localhost");
  });

  it("monta embed YouTube", () => {
    const p = parseStreamUrl("https://youtube.com/watch?v=abcDEF12345");
    if (p.kind !== "YOUTUBE_VIDEO") {
      throw new Error("parse");
    }
    const src = buildEmbedSrc(p, "localhost");
    expect(src).toContain("youtube.com/embed/abcDEF12345");
  });
});
