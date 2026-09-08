"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CIERRE } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { fade } from "./SectionHead";

/**
 * Cierre — nutragen.mx's emotional close ("No necesitas una piel perfecta
 * para merecer bienestar, atención y confianza") + final protocol CTA and
 * the "¿sigues pensando en tu piel?" mini-capture. The bottle has already
 * ascended by the time this fills the viewport.
 */
export function Cierre() {
  return (
    <section
      id="contacto"
      data-stage="contacto"
      className="relative flex min-h-[104svh] w-full flex-col items-center justify-center px-5 py-[14svh] sm:px-10"
    >
      <div className="relative z-10 w-full max-w-5xl text-center">
        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="text-[clamp(2.1rem,5.6vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink"
          lines={[
            [{ t: "no necesitas una" }],
            [
              { t: "piel " },
              { t: "perfecta.", c: "gold-text glow-gold" },
            ],
          ]}
        />

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.3 }}
          className="mt-8 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.3em] text-black/50"
        >
          {CIERRE.line}
        </motion.p>
      </div>

      {/* final CTA + mini capture — interactive layer */}
      <div className="pointer-events-auto relative z-30 mt-12 flex w-full max-w-2xl flex-col items-center gap-6">
        <motion.a
          {...fade}
          transition={{ duration: 0.85, delay: 0.35 }}
          href="/tienda"
          data-testid="cierre-buy"
          className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-gold px-12 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
        >
          <span className="relative z-10">{CIERRE.cta}</span>
          <ArrowRight
            size={13}
            className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"
          />
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.a>

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.45 }}
          className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-black/35"
        >
          Rutina de dos pasos · garantía de 30 días · hecho en México
        </motion.p>
      </div>
    </section>
  );
}
