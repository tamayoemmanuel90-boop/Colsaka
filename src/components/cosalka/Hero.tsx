"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ShieldCheck, Star, Truck } from "lucide-react";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { FLAGSHIP_SLUG, HERO } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

/**
 * Hero — cinematic full-bleed VIDEO stage (client's official film),
 * replacing the former 3D bottle scene. Copy owns the left column over
 * a graded scrim; the film stays untouched behind it. Sells from the
 * very first viewport: rating row, dual CTA, delivery + guarantee chips.
 */
export function Hero() {
  const add = useCart((s) => s.add);
  const [videoOk, setVideoOk] = useState(true);

  const buyNow = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Paquete Doble Acción añadido a la cesta");
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* ── video stage ─────────────────────────────────────────── */}
      <div className="absolute inset-0" aria-hidden={!videoOk}>
        <motion.video
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: videoOk ? 1 : 0, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/nutragen-hero-poster.jpg"
          src="/videos/nutragen-hero-web.mp4"
          onError={() => setVideoOk(false)}
          className="h-full w-full object-cover"
        />
        {/* legibility scrim — left column stays readable, right edge stays cinematic */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/88 via-[#0d0d0d]/55 to-[#0d0d0d]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/70 via-transparent to-[#0d0d0d]/35" />
        {/* blend into the paper page */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#ececee] to-transparent sm:h-36" />
      </div>

      {/* ── copy column ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[1700px] px-5 pb-24 pt-32 sm:px-10 sm:pb-28">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.36em] text-white/85 backdrop-blur-md sm:text-[10px]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
            {HERO.kicker}
          </motion.p>

          <GlowTitle
            as="h1"
            mode="mount"
            delay={0.45}
            stagger={0.024}
            charClassName=""
            className="text-left text-[clamp(2.6rem,5.85vw,5.35rem)] font-medium leading-[0.99] tracking-[-0.049em] text-white"
            lines={[
              [
                { t: "¿Te " },
                { t: "engañan", c: "gold-text glow-gold" },
                { t: " con" },
              ],
              [{ t: "tu propia piel?" }],
            ]}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.9 }}
            className="mt-7 max-w-md text-left font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.3em] text-white/70 sm:text-[10.5px]"
          >
            {HERO.sub}
          </motion.p>

          {/* social proof — sells before the fold */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="flex items-center gap-1.5" aria-label="Calificación 4.9 de 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-gold text-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.55)]"
                />
              ))}
              <span className="ml-1.5 text-[12px] font-semibold tracking-wide text-white">
                4.9/5
              </span>
            </span>
            <span className="h-4 w-px bg-white/25" aria-hidden />
            <span className="text-[11.5px] tracking-wide text-white/75">
              +2,300 pieles acompañadas
            </span>
            <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden />
            <span className="hidden text-[11.5px] tracking-wide text-white/75 sm:block">
              Resultados reales · sin filtros
            </span>
          </motion.div>

          {/* CTAs — interactive layer */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="pointer-events-auto relative z-30 mt-10 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row"
          >
            <button
              onClick={buyNow}
              data-testid="hero-buy"
              className="group relative h-13 w-full cursor-pointer overflow-hidden rounded-full bg-gold px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.4)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(212,175,55,.55)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
            >
              <span className="relative z-10">Comprar ahora · $1,590 MXN</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <button
              onClick={() => scrollToSection("oferta")}
              data-testid="hero-store"
              className="group inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white outline-none backdrop-blur-md transition-all duration-300 hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto"
            >
              <Play size={11} className="fill-current" />
              Ver la oferta
            </button>
          </motion.div>

          {/* delivery + guarantee micro-chips */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.85 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5"
          >
            <li className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
              <Truck size={13} className="text-gold" />
              Envío 24–72 h · gratis desde $1,500
            </li>
            <li className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
              <ShieldCheck size={13} className="text-gold" />
              Garantía de resultados · 30 días
            </li>
          </motion.ul>
        </div>
      </div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
        onClick={() => scrollToSection("oferta")}
        className="cue-float pointer-events-auto absolute bottom-8 left-1/2 z-30 -translate-x-1/2 cursor-pointer p-2 outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        aria-label="Desliza para ver la oferta"
      >
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden>
          <path
            d="M7 1v22M1.5 17.5L7 24l5.5-6.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </section>
  );
}
