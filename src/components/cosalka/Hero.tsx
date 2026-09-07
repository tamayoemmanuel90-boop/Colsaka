"use client";

import { motion } from "framer-motion";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { FLAGSHIP_SLUG, HERO } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

/**
 * Hero — mirror of nutragen.mx's opening hook, Cosalka luxury voice:
 * colossal question "¿te engañan con tu propia piel?" with the 3D bottle
 * floating IN FRONT of the letters (canvas z-20 > text z-10).
 */
export function Hero() {
  const add = useCart((s) => s.add);

  const buyNow = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Nutragen Purity 500 ml añadido a la cesta");
  };

  return (
    <section
      id="inicio"
      data-stage="hero"
      className="relative flex min-h-[102svh] flex-col items-center justify-center overflow-hidden px-5"
    >
      {/* colossal hook — sits BEHIND the bottle (z-10 < canvas z-20) */}
      <div className="relative z-10 w-full max-w-[1700px] text-center">
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
          className="text-[clamp(2.5rem,9.4vw,9rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink"
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
          className="mt-7 font-mono text-[9px] uppercase leading-relaxed tracking-[0.32em] text-black/50 sm:text-[10.5px]"
        >
          {HERO.sub}
        </motion.p>
      </div>

      {/* CTAs — float ABOVE the bottle like a badge (z-30 > canvas) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.7 }}
        className="pointer-events-auto relative z-30 mt-12 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
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
          onClick={() => scrollToSection("tienda")}
          className="h-12 w-full cursor-pointer rounded-full border border-black/20 bg-white/60 px-10 text-[11px] font-medium uppercase tracking-[0.28em] text-black/70 outline-none backdrop-blur-sm transition-all duration-300 hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto"
        >
          Ver productos
        </button>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
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
