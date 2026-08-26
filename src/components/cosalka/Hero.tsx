"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { FLAGSHIP_SLUG } from "@/lib/cosalka/content";
import { GlowTitle } from "./GlowTitle";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

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
      className="hero-vignette relative flex min-h-[108svh] flex-col items-center justify-start overflow-hidden px-5 pt-[19svh] sm:pt-36"
    >
      {/* headline block — the bottle rises to meet it behind */}
      <div className="pointer-events-none relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.05] px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="kicker !text-[9px] text-gold/90">
            Nutragen® · 500 ml
          </span>
        </motion.div>

        <GlowTitle
          as="h1"
          mode="mount"
          delay={0.42}
          stagger={0.03}
          charClassName="glow-soft"
          className="text-balance text-[14vw] font-light leading-[1] tracking-[-0.035em] text-clinic sm:text-7xl md:text-8xl lg:text-[6.2rem]"
          lines={[
            [{ t: "Nutragenética" }],
            [
              { t: "de " },
              {
                t: "Vanguardia",
                c: "gold-text glow-gold not-italic",
              },
            ],
          ]}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.35 }}
          className="mt-4 text-center text-xl font-extralight tracking-wide sm:text-2xl"
        >
          <span className="silver-text glow-white">
            Clínicamente Formulada
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.55 }}
          className="pointer-events-auto mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <button
            onClick={buyNow}
            data-testid="hero-buy"
            className="group relative h-12 w-full cursor-pointer overflow-hidden rounded-full bg-gold px-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_10px_44px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_56px_rgba(212,175,55,.48)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto"
          >
            <span className="relative z-10">Comprar ahora</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          <button
            onClick={() => scrollToSection("tienda")}
            className="h-12 w-full cursor-pointer rounded-full border border-white/20 bg-white/[0.02] px-10 text-[11px] font-medium uppercase tracking-[0.28em] text-white/75 outline-none backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto"
          >
            Ver productos
          </button>
        </motion.div>
      </div>

      {/* scroll cue — icon only */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
        onClick={() => scrollToSection("spotlight")}
        className="cue-float pointer-events-auto absolute bottom-24 z-10 mx-auto cursor-pointer rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        aria-label="Desliza para explorar el producto en 3D"
      >
        <ChevronDown
          size={16}
          className="text-white/40 transition-colors hover:text-gold"
        />
      </motion.button>
    </section>
  );
}
