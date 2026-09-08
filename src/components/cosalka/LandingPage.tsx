"use client";

import { useEffect, useState } from "react";
import { SceneRoot } from "./three/SceneRoot";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Verdad } from "./Verdad";
import { Cierre } from "./Cierre";
import { GaleriaReal } from "./GaleriaReal";
import { Footer } from "./Footer";
import { FrameRails } from "./FrameRails";
import { CartDrawer } from "./CartDrawer";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { initScrollStages } from "@/lib/scroll-engine";
import { useStageStore } from "@/store/stage";
import { useProducts } from "@/hooks/use-products";

/**
 * "/" — PREVIEW ONLY. The presentation lives here; the complete store
 * (Amazon-style, many sections) lives at /tienda + sibling routes.
 *
 * Preview contract:
 *   · NO prices anywhere on this page — products/prices live in the store
 *   · the 3D bottle appears ONLY for the hero moment and EXITS as soon as
 *     the visitor scrolls into the value strip (it stays gone afterwards)
 *   · the client's real photo archive is organized as the bottom gallery
 *
 * Layer architecture:
 *   z-[1] vignette · z-[15] gold shard · z-10 typography (never overlapped)
 *   z-20 fixed WebGL canvas (hero + exit) · z-30 interactive · z-40 rails
 *   z-50 navbar · z-[70+] drawer · z-[75] grain
 */
export function LandingPage() {
  const [ready, setReady] = useState(false);
  const setActiveStage = useStageStore((s) => s.setActive);
  const { products } = useProducts();

  useSmoothScroll(ready);

  useEffect(() => {
    // let the layout settle so stage anchors measure real offsets
    const t = setTimeout(() => {
      initScrollStages((s) => setActiveStage(s));
      setReady(true);
    }, 60);
    return () => clearTimeout(t);
  }, [setActiveStage]);

  return (
    <div className="relative flex min-h-screen flex-col bg-paper text-ink selection:bg-gold selection:text-graphite">
      {/* light cinematic vignette */}
      <div aria-hidden className="paper-vignette pointer-events-none fixed inset-0 z-[1]" />

      {/* fixed WebGL layer — hero moment only, then it leaves the stage */}
      <SceneRoot />

      {/* Mantis-style editorial frame */}
      <FrameRails />

      {/* interactive chrome */}
      <Navbar />

      {/* main content — no stacking context: children pick their own layer */}
      <main className="pointer-events-none relative">
        <Hero />
        <Verdad />
        <Cierre />
        <GaleriaReal />
      </main>

      <Footer />

      <CartDrawer products={products} />

      {/* film grain over everything */}
      <div className="grain pointer-events-none fixed inset-0 z-[75]" aria-hidden />
    </div>
  );
}
