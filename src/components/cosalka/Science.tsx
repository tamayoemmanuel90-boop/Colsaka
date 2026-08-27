"use client";

import { motion } from "framer-motion";
import { SCIENCE_CARDS } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";

/**
 * Science — a tall stage so the exploded clinical layers have room to
 * breathe: heading up top (behind the canvas), three hairline editorial
 * columns anchored at the bottom (interactive layer).
 */
export function Science() {
  return (
    <section
      id="ciencia"
      data-stage="science"
      className="relative flex min-h-[135svh] w-full flex-col justify-between px-5 py-[16svh] sm:px-10"
    >
      {/* heading behind the exploded bottle */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          02 — Sobre nosotros
        </motion.p>

        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="mt-7 text-[clamp(2.4rem,5.4vw,5rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink"
          lines={[
            [
              { t: "ciencia " },
              { t: "verificable.", c: "gold-text glow-gold" },
            ],
          ]}
        />
      </div>

      {/* editorial columns — interactive layer at the bottom of the stage */}
      <div className="pointer-events-auto relative z-30 grid gap-x-12 gap-y-12 md:grid-cols-3">
        {SCIENCE_CARDS.map((card, i) => (
          <motion.article
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.75,
              delay: 0.08 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group border-t border-black/15 pt-7"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.3em] text-gold-deep transition-transform duration-500 group-hover:-translate-y-0.5">
                0{i + 1}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-black/30">
                {card.statLabel}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-medium tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-gold-deep sm:text-2xl">
              {card.title}
            </h3>

            <p className="gold-text glow-soft mt-6 font-mono text-[28px] font-semibold leading-none tracking-tight">
              {card.stat}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
