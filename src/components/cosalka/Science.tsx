"use client";

import { motion } from "framer-motion";
import { HOTSPOTS, SCIENCE_STATS } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 03 · Cómo actúa — nutragen.mx's "Cómo actúa nuestra crema en tu piel"
 * + the 3D skin-model beat. The EXPLODED bottle is the educational
 * model and performs CENTER-RIGHT; every word (heading, stats, hint)
 * lives on the LEFT column — zero overlap, staging law honored.
 */
export function Science() {
  return (
    <section
      id="actua"
      data-stage="actua"
      className="relative flex min-h-[135svh] w-full flex-col justify-between px-5 py-[16svh] sm:px-10"
    >
      {/* heading — LEFT column, clear of the exploded bottle */}
      <SectionHead
        kicker="03 — Cómo actúa · estrato córneo"
        className="max-w-xl"
        lines={[
          [
            { t: "la ciencia " },
            { t: "que se ve.", c: "gold-text glow-gold" },
          ],
        ]}
      />

      {/* bottom cluster — LEFT column, interactive layer */}
      <div className="flex max-w-xl flex-col items-start">
        <motion.dl
          {...fade}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="pointer-events-auto relative z-30 grid w-full max-w-lg grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md"
        >
          {SCIENCE_STATS.map((s) => (
            <div
              key={s.label}
              className="group px-4 py-5 text-center first:rounded-l-2xl last:rounded-r-2xl transition-colors hover:bg-gold/[0.07]"
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
          transition={{ duration: 0.85, delay: 0.35 }}
          className="relative z-30 mt-7 text-[10px] uppercase tracking-[0.26em] text-black/40"
        >
          Toca los <span className="text-gold-deep">nodos dorados</span> ·{" "}
          {HOTSPOTS.length} capas clínicas
        </motion.p>
      </div>
    </section>
  );
}
