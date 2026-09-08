"use client";

import { motion } from "framer-motion";
import { VOCES } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 07 · Voces — nutragen.mx's "Personas reales. Fechas reales." block.
 * Bottle performs LEFT; content stacks on the RIGHT (interactive).
 * Includes the client's REAL case photos (antes/después) and REAL
 * unscripted video testimonials from the brand archive.
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
                { t: "resultados " },
                { t: "reales.", c: "gold-text glow-gold" },
              ],
            ]}
          />

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="relative z-10 mt-6 self-end text-right font-mono text-[9.5px] uppercase tracking-[0.26em] text-black/40"
          >
            &ldquo;{VOCES.quote}&rdquo;
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
                  &ldquo;{v.text}&rdquo;
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

          {/* real before / after case photos — client archive */}
          <div className="pointer-events-auto relative z-30 mt-12 w-full max-w-md">
            <motion.p
              {...fade}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mb-4 text-right font-mono text-[9.5px] uppercase tracking-[0.26em] text-black/40"
            >
              Casos reales · ninguno posado
            </motion.p>
            <div className="grid grid-cols-2 gap-4">
              {VOCES.casos.map((c, i) => (
                <motion.figure
                  key={c.ctx}
                  {...fade}
                  transition={{ duration: 0.75, delay: 0.4 + i * 0.12 }}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
                >
                  <div className="flex flex-col">
                    <div className="relative">
                      <img
                        src={c.before}
                        alt={`Caso real ${c.ctx} — antes del protocolo`}
                        loading="lazy"
                        className="h-36 w-full object-cover object-top sm:h-44"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white">
                        Antes
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={c.after}
                        alt={`Caso real ${c.ctx} — después del protocolo`}
                        loading="lazy"
                        className="h-36 w-full object-cover object-top sm:h-44"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-black">
                        Después
                      </span>
                    </div>
                  </div>
                  <figcaption className="flex items-baseline justify-between border-t border-black/10 px-4 py-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                      {c.ctx}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                      {c.when}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          {/* real unscripted video testimonials — client archive */}
          <div className="pointer-events-auto relative z-30 mt-8 w-full max-w-md">
            <motion.p
              {...fade}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mb-4 text-right font-mono text-[9.5px] uppercase tracking-[0.26em] text-black/40"
            >
              Video-testimonios sin guion
            </motion.p>
            <div className="grid grid-cols-2 gap-4">
              {VOCES.videos.map((v, i) => (
                <motion.figure
                  key={v.src}
                  {...fade}
                  transition={{ duration: 0.75, delay: 0.5 + i * 0.12 }}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
                >
                  <video
                    src={v.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-56 w-full bg-black/90 object-cover sm:h-64"
                    aria-label={v.ctx}
                  />
                  <figcaption className="border-t border-black/10 px-4 py-3 font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                    {v.ctx}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.55 }}
            className="relative z-10 mt-6 self-end text-right text-[10px] tracking-wide text-black/35"
          >
            {VOCES.legal}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
