"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Boots Lenis smooth scrolling and syncs pointer parallax into scrollBus. */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.35,
      syncTouch: false,
    });
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onPointer = (e: PointerEvent) => {
      // imported lazily to keep this hook dependency-light
      void import("@/lib/scroll-engine").then(({ scrollBus }) => {
        scrollBus.mx = (e.clientX / window.innerWidth) * 2 - 1;
        scrollBus.my = (e.clientY / window.innerHeight) * 2 - 1;
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.55, offset: -8 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function lockScroll(lock: boolean) {
  const lenis = window.__lenis;
  if (lock) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}
