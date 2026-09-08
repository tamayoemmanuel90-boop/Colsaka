"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import {
  formatPrice,
  type ProductDTO,
} from "@/lib/products-client";
import { GlowTitle } from "./GlowTitle";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

function ProductCard({ product, index }: { product: ProductDTO; index: number }) {
  const add = useCart((s) => s.add);

  const buy = () => {
    add(product.slug);
    toast.success(`${product.name} · ${product.volumeMl} ml añadido a la cesta`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group pointer-events-auto relative z-30 flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-[0_28px_70px_rgba(13,13,13,0.12)]"
    >
      {/* image — the dark studio shots read as ink blocks on the paper bg */}
      <div className="relative aspect-square overflow-hidden bg-carbon">
        <img
          src={product.image}
          alt={`${product.name} — frasco clínico de ${product.volumeMl} ml`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 font-mono text-[9px] tracking-widest text-black/60 backdrop-blur-sm">
          {product.volumeMl} ML
        </span>
      </div>

      {/* body — name, price, buy. nothing else */}
      <div className="flex flex-col p-5 sm:p-6">
        <h3 className="text-center text-lg font-medium tracking-tight text-ink transition-all duration-300 group-hover:text-gold-deep">
          {product.name}
        </h3>

        <p className="gold-text glow-soft mt-4 text-center text-[26px] font-semibold leading-none tracking-tight">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={buy}
          data-testid={`buy-${product.slug}`}
          aria-label={`Comprar ${product.name} de ${product.volumeMl} mililitros`}
          className="mt-5 flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-gold/60 bg-transparent px-4 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep outline-none transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_8px_30px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
        >
          Comprar ahora
          <ShoppingBag size={12} strokeWidth={2} />
        </button>
      </div>
    </motion.article>
  );
}

/**
 * 08 · Tienda — nutragen.mx's "Paquete Nutragen / de un vistazo" offer.
 * Colossal heading behind the canvas; the 2×2 card grid stays on the LEFT
 * so the bottle keeps the right side of the stage at checkout pose.
 */
export function Gallery() {
  const { products, loading } = useProducts();

  return (
    <section
      id="tienda"
      data-stage="gallery"
      className="relative w-full px-5 py-[16svh] sm:px-10"
    >
      <div className="mx-auto max-w-[1700px]">
        <div className="relative z-10 max-w-[900px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8 }}
            className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
          >
            08 — Tienda · 500 ml
          </motion.p>

          <GlowTitle
            as="h2"
            delay={0.06}
            charClassName=""
            className="mt-7 text-[clamp(2.5rem,5.8vw,5.4rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
            lines={[
              [
                { t: "tu paquete, " },
                { t: "de un vistazo.", c: "gold-text glow-gold" },
              ],
            ]}
          />
        </div>

        {/* grid — interactive layer */}
        {loading ? (
          <div className="mt-14 grid max-w-[900px] gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl border border-black/[0.06] bg-white/60"
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid max-w-[900px] gap-5 sm:grid-cols-2">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}

        {/* full store — real route with many sections */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="pointer-events-auto relative z-30 mt-12"
        >
          <Link
            href="/tienda"
            data-testid="gallery-store-cta"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-gold/60 bg-white/60 px-8 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-deep outline-none backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_10px_36px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
          >
            Ver tienda completa
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 font-mono text-[8.5px] uppercase tracking-[0.24em] text-black/35">
            Detalles clínicos · carrito · checkout seguro · garantía
          </p>
        </motion.div>
      </div>
    </section>
  );
}
