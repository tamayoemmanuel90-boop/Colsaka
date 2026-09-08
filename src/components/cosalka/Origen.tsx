"use client";

import { motion } from "framer-motion";
import { ORIGEN } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 04 · Origen — nutragen.mx's founding story ("Empezó con un diagnóstico
 * que decía 'un par de meses'"). Bottle performs left; story column right
 * with a hairline mono timeline.
 */
export function Origen() {
  return (
    <section
      id="origen"
      data-stage="origen"
      className="relative flex min-h-[108svh] w-full items-center px-5 py-[12svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 lg:grid-cols-2">
        {/* left half — the 3D protagonist performs here */}
        <div aria-hidden className="hidden lg:block" />

        <div className="flex flex-col items-start lg:pl-8">
          <SectionHead
            kicker={ORIGEN.kicker}
            className="self-end text-right"
            lines={[
              [{ t: "empezó con un" }],
              [
                { t: "diagnóstico.", c: "gold-text glow-gold" },
              ],
            ]}
          />

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.25 }}
            className="relative z-10 mt-8 max-w-md text-right text-[13px] leading-relaxed tracking-wide text-black/50"
          >
            {ORIGEN.line}
          </motion.p>

          {/* timeline — interactive layer */}
          <motion.ol
            {...fade}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="pointer-events-auto relative z-30 mt-10 w-full max-w-md space-y-0 border-t border-black/10 text-right"
          >
            {ORIGEN.timeline.map((t) => (
              <li
                key={t.year}
                className="group flex items-baseline justify-between gap-6 border-b border-black/10 py-4 transition-colors hover:bg-gold/[0.05]"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35">
                  {t.label}
                </span>
                <span className="gold-text glow-soft shrink-0 font-mono text-sm font-semibold tracking-tight">
                  {t.year}
                </span>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
