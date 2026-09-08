"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { CIERRE } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { fade } from "./SectionHead";

/**
 * Cierre — nutragen.mx's emotional close ("No necesitas una piel perfecta
 * para merecer bienestar, atención y confianza") + final protocol CTA and
 * the "¿sigues pensando en tu piel?" mini-capture. The bottle has already
 * ascended by the time this fills the viewport.
 */
export function Cierre() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /.+@.+\..+/.test(email.trim());
    if (!ok) {
      toast.error("Introduce un correo válido para recibir la guía.");
      return;
    }
    toast.success("Guía en camino — revisa tu bandeja. Sin spam.");
    setEmail("");
  };

  return (
    <section
      id="contacto"
      data-stage="contacto"
      className="relative flex min-h-[104svh] w-full flex-col items-center justify-center px-5 py-[14svh] sm:px-10"
    >
      <div className="relative z-10 w-full max-w-5xl text-center">
        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="text-[clamp(2.1rem,5.6vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink"
          lines={[
            [{ t: "no necesitas una" }],
            [
              { t: "piel " },
              { t: "perfecta.", c: "gold-text glow-gold" },
            ],
          ]}
        />

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.3 }}
          className="mt-8 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.3em] text-black/50"
        >
          {CIERRE.line}
        </motion.p>
      </div>

      {/* final CTA + mini capture — interactive layer */}
      <div className="pointer-events-auto relative z-30 mt-12 flex w-full max-w-2xl flex-col items-center gap-6">
        <motion.button
          {...fade}
          transition={{ duration: 0.85, delay: 0.35 }}
          onClick={() => scrollToSection("tienda")}
          data-testid="cierre-buy"
          className="group relative h-12 w-full cursor-pointer overflow-hidden rounded-full bg-gold px-12 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
        >
          <span className="relative z-10">{CIERRE.cta}</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>

        <motion.form
          {...fade}
          transition={{ duration: 0.85, delay: 0.45 }}
          onSubmit={subscribe}
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/15 bg-white/70 p-1.5 backdrop-blur-md focus-within:border-gold/60"
        >
          <label htmlFor="cierre-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="cierre-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="¿Sigues pensando en tu piel? — tu correo"
            className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-4 text-[12.5px] tracking-wide text-ink placeholder:text-black/35 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Recibir la guía de cuidado"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-graphite text-gold transition-colors duration-300 hover:bg-gold hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowRight size={15} />
          </button>
        </motion.form>

        <motion.p
          {...fade}
          transition={{ duration: 0.85, delay: 0.55 }}
          className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-black/35"
        >
          Sin spam. Solo la guía y consejos de cuidado de piel.
        </motion.p>
      </div>
    </section>
  );
}
