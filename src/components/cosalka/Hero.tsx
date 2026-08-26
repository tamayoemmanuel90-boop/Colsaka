"use client";

import { motion } from "framer-motion";
import { ChevronDown, FlaskConical } from "lucide-react";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { FLAGSHIP_SLUG } from "@/lib/cosalka/content";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

const HEADLINE = ["Nutragenética", "de Vanguardia"];

export function Hero() {
  const add = useCart((s) => s.add);

  const buyNow = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Nutragen Purity 500 ml añadido a la cesta");
  };

  return (
    <section
      id="inicio"
      data-stage="hero"
      className="hero-vignette relative flex min-h-[108svh] flex-col items-center justify-start overflow-hidden px-5 pt-32 sm:pt-36"
    >
      {/* headline block */}
      <div className="pointer-events-none relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 backdrop-blur-sm"
        >
          <FlaskConical size={12} className="text-gold" />
          <span className="kicker !text-[9px] text-gold/90">
            Línea clínica Nutragen · 500 ml
          </span>
        </motion.div>

        <h1 className="text-balance text-[13vw] font-light leading-[0.98] tracking-[-0.03em] text-clinic sm:text-6xl md:text-7xl lg:text-[5.2rem]">
          {HEADLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.05,
                  delay: 0.45 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {i === 1 ? (
                  <>
                    de{" "}
                    <em className="gold-text not-italic font-normal">
                      Vanguardia
                    </em>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.95 }}
          className="mt-3 text-center text-xl font-extralight tracking-tight sm:text-2xl"
        >
          <span className="silver-text">Clínicamente Formulada</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.08 }}
          className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-relaxed text-white/55 sm:text-[15px]"
        >
          Secuencias minerales de ultrapureza encapsuladas en matrices
          liposomales de precisión. Pureza verificada por HPLC hasta el
          99,98%, sellada en sala limpia ISO Clase 7 — la nutrición celular,
          reescrita como ciencia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25 }}
          className="pointer-events-auto mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <button
            onClick={buyNow}
            data-testid="hero-buy"
            className="group relative h-12 w-full cursor-pointer overflow-hidden rounded-full bg-gold px-9 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_10px_40px_rgba(212,175,55,.28)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(212,175,55,.45)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
          >
            <span className="relative z-10">Comprar ahora</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          <button
            onClick={() => scrollToSection("tienda")}
            className="h-12 w-full cursor-pointer rounded-full border border-white/20 bg-white/[0.02] px-9 text-[11px] font-medium uppercase tracking-[0.28em] text-white/75 outline-none backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto"
          >
            Ver productos
          </button>
        </motion.div>
      </div>

      {/* lab micro-readout — left edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <div className="flex flex-col gap-2 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
          <span>REF · NTG-PUR-500</span>
          <span className="text-gold/50">PUREZA HPLC · 99.97%</span>
          <span>MATRIZ · LIPOSOMAL ≤120nm</span>
          <span>SALA LIMPIA · ISO CLASE 7</span>
          <span className="mt-3 h-px w-24 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        onClick={() => scrollToSection("spotlight")}
        className="cue-float pointer-events-auto absolute bottom-24 z-10 mx-auto cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-full p-2"
        aria-label="Desliza para explorar el producto en 3D"
      >
        <div className="flex flex-col items-center gap-1.5 text-white/40 transition-colors hover:text-gold">
          <span className="kicker !text-[8px]">Explora la molécula</span>
          <ChevronDown size={15} />
        </div>
      </motion.button>
    </section>
  );
}
