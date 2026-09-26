"use client";

import { motion } from "framer-motion";
import { ENVIOS } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 09 · Envíos — nutragen.mx's "México, Estados Unidos y toda
 * Latinoamérica." adapted to Cosalka's markets. Compact centered band;
 * the bottle drifts small and deep behind the stats.
 */
export function Envios() {
  return (
    <section
      id="envios"
      data-stage="envios"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-[14svh] sm:px-10"
    >
      <SectionHead
        kicker={ENVIOS.kicker}
        align="center"
        lines={[
          [
            { t: "Llegamos a " },
            { t: "tu puerta.", c: "gold-text glow-gold" },
          ],
        ]}
      />

      {/* stats strip — interactive layer */}
      <motion.dl
        {...fade}
        transition={{ duration: 0.85, delay: 0.3 }}
        className="pointer-events-auto relative z-30 mt-14 grid w-full max-w-2xl grid-cols-1 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {ENVIOS.stats.map((s) => (
          <div
            key={s.label}
            className="group px-6 py-6 text-center transition-colors hover:bg-gold/[0.07]"
          >
            <dt className="gold-text glow-soft text-2xl font-semibold tracking-tight">
              {s.value}
            </dt>
            <dd className="mt-2 text-[8.5px] uppercase tracking-[0.2em] text-black/45 sm:text-[9px]">
              {s.label}
            </dd>
          </div>
        ))}
      </motion.dl>

      <motion.p
        {...fade}
        transition={{ duration: 0.85, delay: 0.45 }}
        className="relative z-10 mt-9 text-center font-mono text-[9.5px] uppercase tracking-[0.3em] text-black/40"
      >
        {ENVIOS.regiones}
      </motion.p>
    </section>
  );
}
