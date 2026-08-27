"use client";

import { useEffect, useState } from "react";
import { SceneRoot } from "./three/SceneRoot";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Spotlight } from "./Spotlight";
import { Science } from "./Science";
import { Gallery } from "./Gallery";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { FrameRails } from "./FrameRails";
import { CartDrawer } from "./CartDrawer";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { initScrollStages } from "@/lib/scroll-engine";
import { useStageStore } from "@/store/stage";
import { useProducts } from "@/hooks/use-products";

/**
 * Layer architecture (Mantis-style clinical paper):
 *   z-[1]  light paper vignette
 *   z-[15] gold shard accent
 *   z-10   giant typography (BEHIND the 3D — never the protagonist)
 *   z-20   fixed WebGL canvas — THE PROTAGONIST, occludes headlines
 *   z-30   interactive content (cards, stats, CTAs, footer)
 *   z-40   frame rails
 *   z-50   navbar · z-[70+] cart drawer · z-[75] film grain
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

      {/* fixed WebGL layer — the bottle occludes the giant type */}
      <SceneRoot />

      {/* Mantis-style editorial frame */}
      <FrameRails />

      {/* interactive chrome */}
      <Navbar />

      {/* main content — no stacking context: children pick their own layer */}
      <main className="pointer-events-none relative">
        <Hero />
        <Spotlight />
        <Science />
        <Gallery />
        <Faq />
      </main>

      <Footer />

      <CartDrawer products={products} />

      {/* film grain over everything */}
      <div className="grain pointer-events-none fixed inset-0 z-[75]" aria-hidden />
    </div>
  );
}
