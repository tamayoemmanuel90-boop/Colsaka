"use client";

import { motion } from "framer-motion";
import { GlowTitle } from "./GlowTitle";

const STATS = [
  { value: "99.97%", label: "Pureza HPLC" },
  { value: "3.4×", label: "Absorción" },
  { value: "ISO 7", label: "Sala limpia" },
];

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/**
 * Spotlight — the bottle holds the LEFT half of the stage (in front of
 * everything); the giant clinical claim owns the right column behind it.
 * Three beats only: kicker, colossal headline, stat strip.
 */
export function Spotlight() {
  return (
    <section
      id="spotlight"
      data-stage="spotlight"
      className="relative flex min-h-[125svh] w-full items-center px-5 pb-28 pt-[14svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 lg:grid-cols-2">
        {/* left half intentionally empty — the 3D protagonist performs here */}
        <div aria-hidden className="hidden lg:block" />

        {/* giant copy behind the canvas (z-10), stats above it (z-30) */}
        <div className="flex flex-col items-start lg:pl-8">
          <motion.p
            {...fade}
            transition={{ duration: 0.8 }}
            className="relative z-10 font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
          >
            01 — Nutragen Purity
          </motion.p>

          <GlowTitle
            as="h2"
            delay={0.06}
            charClassName=""
            className="relative z-10 mt-7 text-[clamp(2.6rem,6.2vw,5.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink"
            lines={[
              [{ t: "El estándar" }],
              [{ t: "clínico en " }, { t: "500 ml.", c: "gold-text glow-gold" }],
            ]}
          />

          {/* stat strip — interactive layer above the bottle */}
          <motion.dl
            {...fade}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="relative z-30 mt-12 grid max-w-lg grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md pointer-events-auto"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group px-4 py-5 first:rounded-l-2xl last:rounded-r-2xl transition-colors hover:bg-gold/[0.07]"
              >
                <dt className="gold-text glow-soft text-xl font-semibold tracking-tight sm:text-2xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[7.5px] uppercase leading-snug tracking-[0.1em] text-black/45 sm:text-[9px] sm:tracking-[0.16em]">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.5 }}
            className="relative z-30 mt-7 text-[10px] uppercase tracking-[0.26em] text-black/40"
          >
            Toca los <span className="text-gold-deep">nodos dorados</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
