"use client";

import { useEffect, useRef } from "react";

/**
 * LuxCursor — MacBook-style custom pointer.
 * A gold dot tracks the pointer 1:1 while a soft ring trails it with
 * spring-like easing; hovering any interactive element magnifies the
 * ring (Apple-trackpad feel). Enabled only for fine pointers with
 * hover; touch devices and reduced-motion users keep the native UI.
 *
 * The two layers are rendered statically (hidden) — the effect just
 * wires external systems (DOM transforms + class), never setState.
 */
export function LuxCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    root.classList.add("lux-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.x = pos.x;
        ring.y = pos.y;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      // hover intent — magnify over interactive elements
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        "a, button, [role='button'], input, select, textarea, summary, [data-cursor='hover']"
      );
      ringRef.current?.setAttribute("data-hover", String(interactive));
    };

    const onDown = () => ringRef.current?.setAttribute("data-pressed", "true");
    const onUp = () => ringRef.current?.setAttribute("data-pressed", "false");
    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const loop = () => {
      // dot follows instantly, ring eases behind (elastic macOS feel)
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("lux-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="lux-cursor-ring"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="lux-cursor-dot"
        style={{ opacity: 0 }}
      />
    </>
  );
}
