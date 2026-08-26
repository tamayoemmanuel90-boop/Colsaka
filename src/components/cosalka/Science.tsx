"use client";

import { motion } from "framer-motion";
import { Atom, Dna, FlaskConical } from "lucide-react";
import { SCIENCE_CARDS } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";

const ICONS = {
  eficacia: Atom,
  laboratorio: FlaskConical,
  tecnologia: Dna,
} as const;

export function Science() {
  return (
    <section
      id="ciencia"
      data-stage="science"
      className="grain relative w-full px-5 py-36 sm:px-10"
    >
      {/* translucent backdrop so the exploded 3D layers read through */}
      <div className="pointer-events-none absolute inset-x-0 top-28 mx-auto hidden max-w-6xl lg:block">
        <div className="glass-panel h-[460px] rounded-[2rem] opacity-35" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8 }}
            className="kicker !text-[9px] text-gold/80"
          >
            02 · Sobre nosotros
          </motion.p>

          <GlowTitle
            as="h2"
            delay={0.06}
            className="mt-5 text-balance text-4xl font-light leading-[1.08] tracking-[-0.02em] text-clinic sm:text-5xl lg:text-[3.6rem]"
            lines={[
              [
                { t: "Ciencia " },
                {
                  t: "verificable.",
                  c: "gold-text glow-gold font-normal",
                },
              ],
            ]}
          />
        </div>

        {/* minimal glass over the exploded bottle behind */}
        <div className="pointer-events-auto mt-16 grid gap-5 md:grid-cols-3">
          {SCIENCE_CARDS.map((card, i) => {
            const Icon = ICONS[card.id as keyof typeof ICONS];
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-carbon/55 p-8 text-center backdrop-blur-md transition-colors duration-300 hover:border-gold/30 sm:p-9"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-gold/[0.09] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/[0.07] text-gold transition-transform duration-500 group-hover:rotate-[360deg]">
                  <Icon size={20} strokeWidth={1.6} />
                </div>

                <h3 className="text-lg font-medium tracking-tight text-clinic">
                  {card.title}
                </h3>

                <p className="gold-text glow-soft mt-5 font-mono text-2xl font-semibold tracking-tight">
                  {card.stat}
                </p>
                <p className="mt-1.5 text-[9px] uppercase leading-snug tracking-[0.18em] text-white/40">
                  {card.statLabel}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
