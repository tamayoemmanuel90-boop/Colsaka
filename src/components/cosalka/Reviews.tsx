"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { VOCES } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { fade } from "./SectionHead";

const DISTRIBUTION = [
  { stars: 5, pct: 89 },
  { stars: 4, pct: 8 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

/**
 * Reviews — the social-proof wall: rating summary with live-animated
 * distribution bars + verified-purchase testimonial cards. Every review
 * is a real client voice from the Nutragen archive.
 */
export function Reviews() {
  return (
    <section id="resenas" className="relative w-full px-5 py-[9svh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          <Quote size={12} className="text-gold-deep" />
          {VOCES.kicker} · reseñas verificadas
        </motion.p>

        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="relative z-10 mt-6 text-[clamp(2.1rem,4.6vw,4.3rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
          lines={[
            [
              { t: "Quienes ya " },
              { t: "lo viven.", c: "gold-text glow-gold" },
            ],
          ]}
        />

        <div className="pointer-events-auto relative z-30 mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ── rating summary card ─────────────────────────────── */}
          <motion.div
            {...fade}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="flex flex-col justify-between rounded-3xl border border-black/10 bg-graphite p-8 text-white shadow-[0_24px_70px_rgba(13,13,13,0.25)] sm:p-9"
            data-testid="reviews-summary"
          >
            <div>
              <div className="flex items-end gap-4">
                <span className="text-[4.2rem] font-semibold leading-none tracking-[-0.04em] text-gold">
                  4.9
                </span>
                <span className="pb-2">
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} className="fill-gold text-gold" />
                    ))}
                  </span>
                  <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
                    2,347 reseñas verificadas
                  </span>
                </span>
              </div>

              <p className="mt-5 max-w-xs text-[12px] leading-relaxed text-white/60">
                {VOCES.quote}
              </p>
            </div>

            {/* distribution bars */}
            <ul className="mt-8 space-y-2.5">
              {DISTRIBUTION.map((d, i) => (
                <li key={d.stars} className="flex items-center gap-3">
                  <span className="flex w-8 items-center gap-1 font-mono text-[10px] text-white/60">
                    {d.stars}
                    <Star size={9} className="fill-gold text-gold" />
                  </span>
                  <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${d.pct}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.1, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="block h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                    />
                  </span>
                  <span className="w-9 text-right font-mono text-[10px] text-white/45">
                    {d.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── review cards ────────────────────────────────────── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {VOCES.items.map((r, i) => (
              <motion.figure
                key={r.name}
                {...fade}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12 }}
                className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white/85 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_60px_rgba(212,175,55,0.14)]"
              >
                <div>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={12} className="fill-gold text-gold" />
                    ))}
                  </span>
                  <blockquote className="mt-4 text-[13px] leading-relaxed tracking-wide text-black/70">
                    “{r.text}”
                  </blockquote>
                </div>
                <figcaption className="mt-5 border-t border-black/[0.07] pt-4">
                  <span className="flex items-center gap-2 text-[11.5px] font-semibold tracking-wide text-ink">
                    {r.name}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                      <BadgeCheck size={9.5} />
                      Compra verificada
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                    {r.ctx} · {r.when}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        <motion.p
          {...fade}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-7 text-[10px] tracking-wide text-black/35"
        >
          {VOCES.legal}
        </motion.p>
      </div>
    </section>
  );
}
