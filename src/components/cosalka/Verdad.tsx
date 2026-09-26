"use client";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { SCIENCE_STATS, VERDAD } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 01 · La verdad — "no es un apagafuegos químico".
 * LEFT: the real product duo over a clinical card + science stats.
 * RIGHT: giant copy with the honest chips. Words are never covered.
 */
export function Verdad() {
  return (
    <section
      id="verdad"
      className="relative flex min-h-[88svh] w-full items-center px-5 py-[9svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* LEFT — real product visual + clinical stats */}
        <motion.div
          {...fade}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="pointer-events-auto relative z-30 order-2 lg:order-1"
        >
          <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-[0_28px_90px_rgba(13,13,13,0.12)] backdrop-blur-md">
            <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/90 px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-gold-deep backdrop-blur-sm">
              <FlaskConical size={10} />
              Tecnología nutragenética
            </span>
            <img
              src="/images/client/productos-duo.png"
              alt="Protocolo Doble Acción de Nutragen — Paso 1 Treatment y Paso 2 Moisturizer, 500 ml cada uno"
              loading="lazy"
              className="h-64 w-full object-cover sm:h-80"
            />
            {/* stat strip */}
            <ul className="grid grid-cols-3 divide-x divide-black/[0.07] border-t border-black/[0.07] bg-white/90">
              {SCIENCE_STATS.map((s, i) => (
                <motion.li
                  key={s.label}
                  {...fade}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                  className="px-3 py-4 text-center"
                >
                  <span className="block text-[15px] font-semibold tracking-[-0.02em] text-ink sm:text-[17px]">
                    {s.value}
                  </span>
                  <span className="mt-1 block font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.16em] text-black/40">
                    {s.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* RIGHT — the words */}
        <div className="order-1 flex flex-col items-start lg:order-2 lg:items-end lg:pl-8">
          <SectionHead
            kicker={VERDAD.kicker}
            className="self-auto text-left lg:self-end lg:text-right"
            lines={[
              [
                { t: "Sin " },
                { t: "corticoides.", c: "gold-text glow-gold" },
              ],
              [{ t: "Sin rebote." }],
            ]}
          />

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.25 }}
            className="relative z-10 mt-8 max-w-md text-left text-[13px] leading-relaxed tracking-wide text-black/50 lg:text-right"
          >
            {VERDAD.line}
          </motion.p>

          {/* clinical chips — interactive layer */}
          <motion.ul
            {...fade}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="pointer-events-auto relative z-30 mt-9 flex flex-wrap gap-2 lg:justify-end"
          >
            {VERDAD.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-deep backdrop-blur-sm transition-colors duration-300 hover:bg-gold hover:text-graphite"
              >
                {c}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
