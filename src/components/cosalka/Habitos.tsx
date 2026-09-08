"use client";

import { motion } from "framer-motion";
import { HABITOS } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 06 · Cuatro hábitos — nutragen.mx's "Cuatro hábitos que multiplican
 * tus resultados". Deep-back bottle, heading top, four hairline columns.
 */
export function Habitos() {
  return (
    <section
      id="habitos"
      data-stage="habitos"
      className="relative flex min-h-[118svh] w-full flex-col justify-between px-5 py-[16svh] sm:px-10"
    >
      <SectionHead
        kicker="06 — Complementos gratis"
        className="max-w-xl"
        lines={[
          [
            { t: "cuatro " },
            { t: "hábitos.", c: "gold-text glow-gold" },
            { t: " más resultados." },
          ],
        ]}
      />

      {/* editorial columns — interactive layer at the bottom of the stage */}
      <div className="pointer-events-auto relative z-30 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {HABITOS.map((h, i) => (
          <motion.article
            key={h.id}
            {...fade}
            transition={{
              duration: 0.75,
              delay: 0.08 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group border-t border-black/15 pt-6"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.3em] text-gold-deep transition-transform duration-500 group-hover:-translate-y-0.5">
                0{i + 1}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-black/30">
                gratis
              </span>
            </div>

            <h3 className="mt-5 text-lg font-medium tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-gold-deep sm:text-xl">
              {h.title}
            </h3>

            <p className="mt-3 text-[12px] leading-relaxed text-black/50">
              {h.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
