"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RUTINA } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 02 · Doble acción — the two-step protocol as shoppable cards.
 * Real product photography, real cadence (mañana/noche), each card
 * linking to its product page. Amazon-grade clarity, editorial skin.
 */
export function Rutina() {
  return (
    <section
      id="rutina"
      className="relative w-full px-5 py-[9svh] sm:px-10"
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          kicker={RUTINA.kicker}
          align="center"
          titleClassName="mt-6 text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink"
          lines={[
            [{ t: "Dos pasos." }, { t: " Una rutina.", c: "gold-text glow-gold" }],
          ]}
        />

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.45 }}
          className="relative z-10 mt-5 text-center font-mono text-[9.5px] uppercase tracking-[0.3em] text-black/40"
        >
          {RUTINA.meta}
        </motion.p>

        {/* step cards */}
        <div className="relative z-30 mx-auto mt-12 grid w-full gap-6 md:grid-cols-2">
          {RUTINA.steps.map((s, i) => (
            <motion.article
              key={s.n}
              {...fade}
              transition={{ duration: 0.8, delay: 0.12 + i * 0.16 }}
              className="pointer-events-auto group overflow-hidden rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_70px_rgba(212,175,55,0.16)]"
            >
              <div className="relative">
                <img
                  src={s.img}
                  alt={`${s.title} — frasco de 500 ml`}
                  loading="lazy"
                  className="aspect-[4/5] w-full bg-[#f7f5f0] object-contain p-6 transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-graphite/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-gold backdrop-blur-sm">
                  {s.n}
                </span>
                <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/85 px-2.5 py-1 font-mono text-[8.5px] tracking-[0.2em] text-black/55 backdrop-blur-sm">
                  500 ML
                </span>
              </div>

              <div className="p-7">
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-gold-deep">
                  {s.title}
                </h3>

                <p className="mt-3 text-[13px] leading-relaxed text-black/55">
                  {s.body}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">
                    {i === 0 ? "Mañana · aplicarlo limpio" : "Noche · círculos suaves"}
                  </span>
                  <Link
                    href={`/producto/${s.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gold-deep transition-colors hover:text-ink"
                    aria-label={`Ver ficha de ${s.title}`}
                  >
                    Ver ficha
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
