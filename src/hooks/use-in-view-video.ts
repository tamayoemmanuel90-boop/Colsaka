"use client";

import { useEffect, useRef } from "react";

/**
 * useInViewVideo — scroll-triggered playback for ambient product videos.
 *
 * Plays (muted + loop, autoplay-policy safe) while the video is scrolled
 * into view and pauses when it leaves. A module-level coordinator caps
 * how many videos decode at the same time (MAX_CONCURRENT) and always
 * prioritizes the most-visible ones — keeps the page smooth even with a
 * WebGL scene running.
 */

const MAX_CONCURRENT = 8;

type Entry = {
  el: HTMLVideoElement;
  ratio: number;
  want: boolean;
};

const entries = new Map<HTMLVideoElement, Entry>();

function rebalance() {
  const candidates = [...entries.values()]
    .filter((e) => e.want)
    .sort((a, b) => b.ratio - a.ratio);

  const shouldPlay = new Set<HTMLVideoElement>();
  for (const c of candidates) {
    if (shouldPlay.size >= MAX_CONCURRENT) break;
    shouldPlay.add(c.el);
  }

  entries.forEach(({ el }) => {
    if (shouldPlay.has(el)) {
      if (el.paused) void el.play().catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  });
}

export function useInViewVideo<T extends HTMLVideoElement = HTMLVideoElement>(
  threshold = 0.35,
  enabled = true
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;

    const entry: Entry = { el: video, ratio: 0, want: false };
    entries.set(video, entry);

    const observer = new IntersectionObserver(
      ([e]) => {
        entry.ratio = e.intersectionRatio;
        entry.want = enabled && e.intersectionRatio >= threshold;
        rebalance();
      },
      { threshold: [0, 0.15, 0.35, 0.5, 0.75, 1] }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      entries.delete(video);
      video.pause();
      rebalance();
    };
  }, [threshold, enabled]);

  return ref;
}
