"use client";

import { motion } from "framer-motion";
import { GARANTIA } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 10 · Garantía — nutragen.mx's "No te vendemos un frasco. Te acompañamos
 * 30 días." + the GARANTÍA DE DEVOLUCIÓN seal, rebuilt as a slowly
 * rotating clinical badge. Staging law: the whole text column (heading,
 * seal, promise, email) sits LEFT; the bottle performs RIGHT.
 */
export function Garantia() {
  return (
    <section
      id="garantia"
      className="relative flex min-h-[92svh] w-full items-center px-5 py-[10svh] sm:px-10"
    >
      <div className="grid w-full max-w-[1700px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div className="max-w-xl">
        <SectionHead
          kicker={GARANTIA.kicker}
          className="max-w-xl"
          titleClassName="mt-6 text-[clamp(2rem,4.2vw,3.8rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink"
          lines={[
            [{ t: "No vendemos un frasco." }],
            [
              { t: "Te acompañamos " },
              { t: "30 días.", c: "gold-text glow-gold" },
            ],
          ]}
        />

        {/* rotating clinical seal — interactive layer */}
        <motion.div
          {...fade}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="pointer-events-auto relative z-30 mt-9"
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 196 196"
            fill="none"
            role="img"
            aria-label="Sello de garantía de devolución de 30 días"
            className="drop-shadow-[0_18px_44px_rgba(212,175,55,0.3)]"
          >
            {/* rotating ring — text on circular path */}
            <g className="seal-spin" style={{ transformOrigin: "98px 98px" }}>
              <circle cx="98" cy="98" r="94" stroke="#D4AF37" strokeWidth="1" opacity="0.55" />
              <circle cx="98" cy="98" r="86" stroke="#D4AF37" strokeWidth="1.6" opacity="0.9" />
              <circle cx="98" cy="98" r="64" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
              <defs>
                <path
                  id="sealArc"
                  d="M98,98 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0"
                />
              </defs>
              <text
                fill="#9d7c26"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                }}
              >
                <textPath href="#sealArc">
                  garantía de devolución · 100% · 30 días ·
                </textPath>
              </text>
            </g>
            {/* static center */}
            <text
              x="98"
              textAnchor="middle"
              y="113"
              fill="#141416"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 44,
                fontWeight: 600,
                letterSpacing: "-0.03em",
              }}
            >
              30
            </text>
            <text
              x="98"
              textAnchor="middle"
              y="132"
              fill="#9d7c26"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 8.5,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              días
            </text>
          </svg>
        </motion.div>

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.45 }}
          className="relative z-30 mt-8 max-w-md text-left text-[13px] leading-relaxed tracking-wide text-black/50"
        >
          {GARANTIA.line}
        </motion.p>

        <motion.a
          {...fade}
          transition={{ duration: 0.85, delay: 0.55 }}
          href={`mailto:${GARANTIA.email}`}
          className="pointer-events-auto relative z-30 mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-gold-deep underline-offset-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          {GARANTIA.email} · respuesta el mismo día
        </motion.a>
      </div>

      {/* RIGHT — real production floor: the guarantee is backed by a real lab */}
      <motion.figure
        {...fade}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="pointer-events-auto relative z-30 overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-[0_28px_90px_rgba(13,13,13,0.12)] backdrop-blur-md"
      >
        <img
          src="/images/client/produccion-real.jpg"
          alt="Producción real de Nutragen en México — frascos de 500 ml en el laboratorio"
          loading="lazy"
          className="h-72 w-full object-cover sm:h-[26rem]"
        />
        <figcaption className="flex items-baseline justify-between border-t border-black/10 px-5 py-4">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/40">
            Producción real · Cosalka México
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-gold-deep">
            Lote sellado · 500 ml
          </span>
        </figcaption>
      </motion.figure>
      </div>
    </section>
  );
}
