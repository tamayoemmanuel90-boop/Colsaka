"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SceneRoot } from "./three/SceneRoot";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Spotlight } from "./Spotlight";
import { Science } from "./Science";
import { Gallery } from "./Gallery";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { initScrollStages } from "@/lib/scroll-engine";
import { useStageStore } from "@/store/stage";
import { useProducts } from "@/hooks/use-products";

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
    <div className="relative min-h-screen flex flex-col bg-graphite text-clinic selection:bg-gold selection:text-graphite">
      {/* fixed WebGL layer behind all content */}
      <SceneRoot />

      {/* global film grain */}
      <div className="grain pointer-events-none fixed inset-0 z-[5]" aria-hidden />

      {/* interactive DOM above the canvas */}
      <Navbar />

      <main className="relative z-10 pointer-events-none">
        <Hero />
        <Spotlight />
        <Science />
        <Gallery />
        <Faq />
      </main>

      <Footer />

      {/* subtle edge vignette for cinematic depth */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 50%, transparent 66%, rgba(0,0,0,.45) 100%)",
        }}
      />

      <CartDrawer products={products} />
    </div>
  );
}
