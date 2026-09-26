"use client";

import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { TrustBar } from "./TrustBar";
import { BuyBox } from "./BuyBox";
import { Verdad } from "./Verdad";
import { Rutina } from "./Rutina";
import { Reviews } from "./Reviews";
import { GaleriaReal } from "./GaleriaReal";
import { Garantia } from "./Garantia";
import { Faq } from "./Faq";
import { Cierre } from "./Cierre";
import { Footer } from "./Footer";
import { FrameRails } from "./FrameRails";
import { CartDrawer } from "./CartDrawer";
import { StickyBuyBar } from "./StickyBuyBar";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useProducts } from "@/hooks/use-products";

/**
 * "/" — Cosalka · Nutragen flagship storefront landing.
 *
 * Sell-first architecture (Amazon-grade conversion flow):
 *   announcement → cinematic video hero → trust strip → BUY BOX
 *   → truth → routine → verified reviews → real archive
 *   → guarantee → FAQ → close.
 *
 * Layer architecture:
 *   z-[1] vignette · z-10 typography · z-30 interactive · z-50 navbar
 *   z-[60] sticky buy bar · z-[70+] drawer · z-[75] grain
 */
export function LandingPage() {
  const { products } = useProducts();

  useSmoothScroll(true);

  return (
    <div className="relative flex min-h-screen flex-col bg-paper text-ink selection:bg-gold selection:text-graphite">
      {/* light cinematic vignette */}
      <div aria-hidden className="paper-vignette pointer-events-none fixed inset-0 z-[1]" />

      {/* Mantis-style editorial frame */}
      <FrameRails />

      {/* interactive chrome */}
      <Navbar />

      {/* main content — no stacking context: children pick their own layer */}
      <main className="pointer-events-none relative">
        <Hero />
        <TrustBar />
        <BuyBox />
        <Verdad />
        <Rutina />
        <Reviews />
        <GaleriaReal />
        <Garantia />
        <Faq />
        <Cierre />
      </main>

      <Footer />

      <CartDrawer products={products} />

      {/* Amazon-style mobile buy bar */}
      <StickyBuyBar />

      {/* film grain over everything */}
      <div className="grain pointer-events-none fixed inset-0 z-[75]" aria-hidden />
    </div>
  );
}
