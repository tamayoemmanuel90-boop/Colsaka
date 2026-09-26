"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BadgePercent, Check, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { FLAGSHIP_SLUG } from "@/lib/cosalka/content";
import { useProducts, } from "@/hooks/use-products";
import { formatPrice } from "@/lib/products-client";
import { useCart } from "@/store/cart";
import { SectionHead, fade } from "./SectionHead";
import { ApplePayMark, GooglePayMark, MastercardMark, VisaMark } from "@/components/store/payments/brand-marks";

/**
 * BuyBox — the Amazon conversion core, right on the landing.
 * Flagship offer with real price from the catalog API, launch anchor,
 * verified-rating row, free-shipping math, stock urgency and a dual
 * CTA (add to cart / buy now → checkout). Payment marks answer the
 * last objection before the click.
 */
export function BuyBox() {
  const { products } = useProducts();
  const add = useCart((s) => s.add);
  const router = useRouter();

  const p =
    products.find((x) => x.slug === FLAGSHIP_SLUG) ?? products[products.length - 1];

  const compareAt = Math.round((p.price / 0.8) / 10) * 10; // −20% launch anchor
  const discount = Math.round((1 - p.price / compareAt) * 100);

  const addToCart = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Añadido a la cesta — envío gratis aplicado");
  };

  const buyNow = () => {
    add(FLAGSHIP_SLUG);
    router.push("/checkout");
  };

  return (
    <section id="oferta" className="relative w-full px-5 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          kicker="La oferta — precio directo de laboratorio"
          align="left"
          lines={[
            [
              { t: "El " },
              { t: "protocolo", c: "gold-text glow-gold" },
              { t: " completo." },
            ],
          ]}
          titleClassName="mt-6 text-[clamp(2rem,4.4vw,3.9rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
        />

        <motion.div
          {...fade}
          transition={{ duration: 0.85, delay: 0.15 }}
          data-testid="buybox"
          className="pointer-events-auto relative z-30 mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-[0_24px_80px_rgba(13,13,13,0.09)] backdrop-blur-md"
        >
          <div className="grid lg:grid-cols-[0.94fr_1.06fr]">
            {/* ── visual ──────────────────────────────────────── */}
            <div className="relative border-b border-black/[0.07] bg-[#f4f2ec] lg:border-b-0 lg:border-r">
              <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-graphite shadow-[0_8px_24px_rgba(212,175,55,0.45)]">
                <Star size={10} className="fill-graphite" />
                Más vendido
              </span>
              <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/60 backdrop-blur-sm">
                2 × 500 ml
              </span>
              <img
                src={p.image}
                alt={`${p.name} — ${p.tagline}`}
                loading="lazy"
                className="h-72 w-full object-cover transition-transform duration-700 hover:scale-[1.025] sm:h-96 lg:h-full"
              />
            </div>

            {/* ── offer column ───────────────────────────────── */}
            <div className="flex flex-col p-6 sm:p-9">
              {/* rating row */}
              <a
                href="#resenas"
                className="group inline-flex w-fit items-center gap-2"
                aria-label="Ver reseñas verificadas"
              >
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13.5} className="fill-gold text-gold" />
                  ))}
                </span>
                <span className="text-[12px] font-semibold text-ink">4.9</span>
                <span className="text-[11px] tracking-wide text-black/45 underline decoration-black/20 underline-offset-4 transition-colors group-hover:text-gold-deep">
                  2,347 reseñas verificadas
                </span>
              </a>

              <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
                {p.name}
              </h3>
              <p className="mt-1.5 text-[12.5px] tracking-wide text-black/50">
                {p.tagline} · acompañamiento personalizado 30 días
              </p>

              {/* price block */}
              <div className="mt-5 flex flex-wrap items-end gap-x-3.5 gap-y-2">
                <span className="text-[2.1rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                  {formatPrice(p.price)}
                </span>
                <span className="text-[13px] font-normal text-black/35">MXN</span>
                <s className="pb-0.5 text-[14px] text-black/35">{formatPrice(compareAt)}</s>
                <span className="inline-flex items-center gap-1 rounded-md bg-gold/15 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-gold-deep">
                  <BadgePercent size={11} />
                  −{discount}% lanzamiento
                </span>
              </div>
              <p className="mt-2 text-[11px] tracking-wide text-emerald-700">
                Envío <strong>GRATIS</strong> incluido · IVA incluido · paga con tarjeta, Google Pay o Apple Pay
              </p>

              {/* benefits */}
              <ul className="mt-5 grid gap-2.5">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-black/65">
                    <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* stock */}
              <p className="mt-5 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-black/45">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                </span>
                En stock — sale del laboratorio hoy · quedan 37 lotes
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={addToCart}
                  data-testid="buybox-add"
                  className="group relative h-12 flex-1 cursor-pointer overflow-hidden rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_12px_36px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft"
                >
                  <span className="relative z-10">Agregar al carrito</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
                <button
                  onClick={buyNow}
                  data-testid="buybox-buy"
                  className="h-12 flex-1 cursor-pointer rounded-full bg-graphite text-[10.5px] font-medium uppercase tracking-[0.26em] text-white outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_16px_44px_rgba(13,13,13,.35)] focus-visible:ring-2 focus-visible:ring-graphite/50"
                >
                  Comprar ahora
                </button>
              </div>

              {/* payment marks + guarantee */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-black/[0.07] pt-5">
                <span className="flex items-center gap-2.5">
                  <VisaMark size={30} />
                  <MastercardMark size={27} />
                  <span className="rounded-md border border-black/10 bg-white px-1.5 py-1 shadow-sm">
                    <GooglePayMark size={14} />
                  </span>
                  <span className="rounded-md border border-black/10 bg-white px-1.5 py-1 shadow-sm">
                    <ApplePayMark size={13} />
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-black/45">
                  <ShieldCheck size={13} className="text-gold-deep" />
                  Compra protegida · garantía 30 días
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
