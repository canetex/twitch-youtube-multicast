import { describe, expect, it } from "vitest";

import { build_embed_src, parse_stream_url } from "@/utils/embedUrls";

describe("parse_stream_url", () => {
  it("Twitch canal", () => {
    const r = parse_stream_url("https://www.twitch.tv/shroud");
    expect(r.kind).toBe("TWITCH_CHANNEL");
  });

  it("YouTube watch", () => {
    const r = parse_stream_url("https://youtube.com/watch?v=dQw4w9WgXcQ");
    expect(r.kind).toBe("YOUTUBE_VIDEO");
  });
});

describe("build_embed_src", () => {
  it("parent Twitch", () => {
    const p = parse_stream_url("twitch.tv/shroud");
    if (p.kind !== "TWITCH_CHANNEL") {
      throw new Error("parse");
    }
    const src = build_embed_src(p, "localhost");
    expect(src).toContain("player.twitch.tv");
    expect(src).toContain("parent=localhost");
  });
});
