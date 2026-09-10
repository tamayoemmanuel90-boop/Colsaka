"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Camera, Clock } from "lucide-react";
import { VOCES } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { fade } from "./SectionHead";

/**
 * Galería — the organized client archive at the BOTTOM of the preview:
 * before/after case pairs in a clean grid + the unscripted video
 * testimonials. No prices here — "/" is presentation only.
 */
export function GaleriaReal() {
  return (
    <section
      id="galeria"
      data-stage="gallery"
      className="relative w-full px-5 py-[14svh] sm:px-10"
      aria-label="Galería de casos reales"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          <Camera size={12} className="text-gold-deep" />
          {VOCES.kicker} · archivo real
        </motion.p>

        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="relative z-10 mt-6 text-[clamp(2.2rem,4.8vw,4.4rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
          lines={[
            [
              { t: "la " },
              { t: "galería", c: "gold-text glow-gold" },
              { t: " real." },
            ],
          ]}
        />

        {/* before / after pairs — organized grid */}
        <div className="pointer-events-auto relative z-30 mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* real before/after pairs */}
          {VOCES.casos.map((c, i) => (
            <motion.figure
              key={c.ctx}
              {...fade}
              transition={{ duration: 0.75, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
            >
              <div className="relative">
                <img
                  src={c.before}
                  alt={`Caso real ${c.ctx} — antes del protocolo`}
                  loading="lazy"
                  className="h-52 w-full object-cover object-top"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white">
                  Antes
                </span>
              </div>
              <div className="relative">
                <img
                  src={c.after}
                  alt={`Caso real ${c.ctx} — después del protocolo`}
                  loading="lazy"
                  className="h-52 w-full object-cover object-top"
                />
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-graphite">
                  Después
                </span>
              </div>
              <figcaption className="flex items-baseline justify-between border-t border-black/10 px-4 py-3">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink">
                  {c.ctx}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                  {c.when}
                </span>
              </figcaption>
            </motion.figure>
          ))}

          {/* real production photo */}
          <motion.figure
            {...fade}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
          >
            <img
              src="/images/client/produccion-real.jpg"
              alt="Producción real de Nutragen en México — frascos de 500 ml"
              loading="lazy"
              className="h-full max-h-[452px] w-full object-cover"
            />
            <figcaption className="border-t border-black/10 px-4 py-3 font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
              Producción real · Cosalka México
            </figcaption>
          </motion.figure>
        </div>

        {/* real archive records — combined photo + honest ongoing case */}
        <div className="pointer-events-auto relative z-30 mt-6 grid gap-6 sm:grid-cols-2">
          {VOCES.registros.map((r, i) => (
            <motion.figure
              key={r.src}
              {...fade}
              transition={{ duration: 0.75, delay: 0.12 + i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
            >
              <div className="relative">
                <img
                  src={r.src}
                  alt={
                    r.kind === "combined"
                      ? `Caso real ${r.ctx} — antes y después del protocolo`
                      : `Caso real ${r.ctx} — registro en curso`
                  }
                  loading="lazy"
                  className="h-64 w-full object-cover object-top sm:h-72"
                />
                {r.kind === "combined" ? (
                  <>
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white">
                      Antes
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-graphite">
                      Después
                    </span>
                  </>
                ) : (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-graphite">
                    <Clock size={9} strokeWidth={2.4} />
                    En tratamiento
                  </span>
                )}
              </div>
              <figcaption className="flex items-baseline justify-between border-t border-black/10 px-4 py-3">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink">
                  {r.ctx}
                  {r.kind === "combined" && (
                    <span className="ml-2 font-mono text-[8.5px] font-normal uppercase tracking-[0.18em] text-black/40">
                      antes · después
                    </span>
                  )}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                  {r.when}
                </span>
              </figcaption>
              {r.kind === "ongoing" && (
                <p className="border-t border-black/10 px-4 pb-3.5 text-[10px] leading-relaxed tracking-wide text-black/40">
                  Evolución real del protocolo. El "después" se publica al cerrar el registro.
                </p>
              )}
            </motion.figure>
          ))}
        </div>

        {/* unscripted video testimonials */}
        <div className="pointer-events-auto relative z-30 mt-8 grid gap-6 sm:grid-cols-2">
          {VOCES.videos.map((v, i) => (
            <motion.figure
              key={v.src}
              {...fade}
              transition={{ duration: 0.75, delay: 0.3 + i * 0.12 }}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
            >
              <video
                src={v.src}
                controls
                playsInline
                preload="metadata"
                className="h-64 w-full bg-black/90 object-cover sm:h-72"
                aria-label={v.ctx}
              />
              <figcaption className="border-t border-black/10 px-4 py-3 font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/40">
                {v.ctx}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.p
          {...fade}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-7 text-[10px] tracking-wide text-black/35"
        >
          {VOCES.legal}
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pointer-events-auto relative z-30 mt-9"
        >
          <Link
            href="/tienda"
            data-testid="galeria-store-cta"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
          >
            Conocer los productos
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
