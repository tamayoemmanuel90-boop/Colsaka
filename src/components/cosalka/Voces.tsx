"use client";

import { motion } from "framer-motion";
import { VOCES } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 07 · Voces — nutragen.mx's "Personas reales. Fechas reales." block.
 * Bottle performs LEFT; three quote cards stack on the RIGHT (interactive).
 */
export function Voces() {
  return (
    <section
      id="voces"
      data-stage="voces"
      className="relative flex min-h-[116svh] w-full items-center px-5 py-[12svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 lg:grid-cols-2">
        {/* left half — the 3D protagonist performs here */}
        <div aria-hidden className="hidden lg:block" />

        <div className="flex flex-col items-start lg:pl-8">
          <SectionHead
            kicker={VOCES.kicker}
            className="self-end text-right"
            lines={[
              [{ t: "personas reales." }],
              [
                { t: "resultados ", },
                { t: "reales.", c: "gold-text glow-gold" },
              ],
            ]}
          />

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="relative z-10 mt-6 self-end text-right font-mono text-[9.5px] uppercase tracking-[0.26em] text-black/40"
          >
            “{VOCES.quote}”
          </motion.p>

          {/* quote cards — interactive layer */}
          <div className="pointer-events-auto relative z-30 mt-10 w-full max-w-md space-y-4">
            {VOCES.items.map((v, i) => (
              <motion.figure
                key={v.name}
                {...fade}
                transition={{ duration: 0.75, delay: 0.15 + i * 0.13 }}
                className="group rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-white/90"
              >
                <blockquote className="text-[13.5px] leading-relaxed tracking-wide text-ink/80">
                  “{v.text}”
                </blockquote>
                <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-black/10 pt-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                    {v.name}
                  </span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/40">
                    {v.ctx} · {v.when}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.5 }}
            className="relative z-10 mt-6 self-end text-right text-[10px] tracking-wide text-black/35"
          >
            {VOCES.legal}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
