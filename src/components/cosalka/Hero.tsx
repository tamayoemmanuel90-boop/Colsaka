"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { FLAGSHIP_SLUG, HERO } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

/**
 * Hero — the hook question owns the LEFT column; the 3D bottle performs
 * on the RIGHT half (never over the title, staging law). On stacked
 * mobile layouts the text comes first and a reserved zone below hosts
 * the bottle.
 */
export function Hero() {
  const add = useCart((s) => s.add);
  const router = useRouter();

  const buyNow = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Paquete Doble Acción añadido a la cesta");
  };

  return (
    <section
      id="inicio"
      data-stage="hero"
      className="relative flex min-h-[104svh] w-full items-center overflow-hidden px-5 pb-16 pt-28 sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 items-center gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-4">
        {/* LEFT — the words (title never touched by the 3D) */}
        <div className="relative z-10 flex flex-col items-start">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="mb-6 font-mono text-[9px] uppercase tracking-[0.42em] text-black/45 sm:text-[10px]"
          >
            {HERO.kicker}
          </motion.p>

          <GlowTitle
            as="h1"
            mode="mount"
            delay={0.4}
            stagger={0.024}
            charClassName=""
            className="text-left text-[clamp(2.5rem,6.1vw,6.2rem)] font-medium leading-[0.99] tracking-[-0.045em] text-ink"
            lines={[
              [
                { t: "¿te " },
                { t: "engañan", c: "gold-text glow-gold" },
                { t: " con" },
              ],
              [{ t: "tu propia piel?" }],
            ]}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.85 }}
            className="mt-7 max-w-md text-left font-mono text-[9px] uppercase leading-relaxed tracking-[0.32em] text-black/50 sm:text-[10.5px]"
          >
            {HERO.sub}
          </motion.p>

          {/* CTAs — interactive layer */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.55 }}
            className="pointer-events-auto relative z-30 mt-11 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row"
          >
            <button
              onClick={buyNow}
              data-testid="hero-buy"
              className="group relative h-12 w-full cursor-pointer overflow-hidden rounded-full bg-gold px-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
            >
              <span className="relative z-10">Comprar ahora</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <button
              onClick={() => router.push("/tienda")}
              data-testid="hero-store"
              className="h-12 w-full cursor-pointer rounded-full border border-black/20 bg-white/60 px-10 text-[11px] font-medium uppercase tracking-[0.28em] text-black/70 outline-none backdrop-blur-sm transition-all duration-300 hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto"
            >
              Ver tienda
            </button>
          </motion.div>
        </div>

        {/* RIGHT (desktop) — the bottle performs here */}
        <div aria-hidden className="hidden lg:block" />

        {/* mobile — reserved bottle zone below the words */}
        <div aria-hidden className="h-[36svh] w-full lg:hidden" />
      </div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => scrollToSection("verdad")}
        className="cue-float pointer-events-auto absolute bottom-8 left-1/2 z-30 -translate-x-1/2 cursor-pointer p-2 outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        aria-label="Desliza para descubrir la verdad"
      >
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden>
          <path
            d="M7 1v22M1.5 17.5L7 24l5.5-6.5"
            stroke="rgba(13,13,13,0.45)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </section>
  );
}
