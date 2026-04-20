"use client";

import { useCallback } from "react";

export function IntroReplay() {
  const onReplay = useCallback(() => {
    try {
      localStorage.removeItem("reveal_intro_seen");
    } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("intro", "1");
    window.location.href = url.toString();
  }, []);

  return (
    <button
      type="button"
      id="introReplay"
      className="intro-replay is-ready"
      aria-label="Replay brand intro"
      title="Replay intro"
      onClick={onReplay}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
    </button>
  );
}
