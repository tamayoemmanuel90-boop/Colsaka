"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-carbon/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-gold/40 hover:shadow-[0_24px_70px_rgba(0,0,0,.5)]"
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-graphite">
        <img
          src={product.image}
          alt={`${product.name} — frasco clínico de ${product.volumeMl} ml`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-gold/50 bg-graphite/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-graphite/70 px-2.5 py-1 font-mono text-[9px] tracking-widest text-silver backdrop-blur-sm">
          {product.volumeMl} ML
        </span>
      </div>

      {/* body — name, price, buy. nothing else */}
      <div className="flex flex-col p-5 sm:p-6">
        <h3 className="text-center text-lg font-medium tracking-tight text-clinic transition-all duration-300 group-hover:text-gold-soft group-hover:[text-shadow:0_0_24px_rgba(232,207,143,.35)]">
          {product.name}
        </h3>

        <p className="gold-text glow-soft mt-4 text-center text-[26px] font-semibold leading-none tracking-tight">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={buy}
          data-testid={`buy-${product.slug}`}
          aria-label={`Comprar ${product.name} de ${product.volumeMl} mililitros`}
          className="pointer-events-auto mt-5 flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-gold/45 bg-gold/[0.08] px-4 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold outline-none transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_8px_30px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
        >
          Comprar ahora
          <ShoppingBag size={12} strokeWidth={2} />
        </button>
      </div>
    </motion.article>
  );
}

export function Gallery() {
  const { products, loading } = useProducts();

  return (
    <section
      id="tienda"
      data-stage="gallery"
      className="relative w-full px-5 py-32 sm:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8 }}
            className="kicker !text-[9px] text-gold/80"
          >
            03 · Tienda · 500 ml
          </motion.p>

          <GlowTitle
            as="h2"
            delay={0.06}
            className="mt-5 text-balance text-4xl font-light leading-[1.08] tracking-[-0.02em] text-clinic sm:text-5xl lg:text-[3.6rem]"
            lines={[
              [
                { t: "La colección " },
                {
                  t: "Nutragen.",
                  c: "gold-text glow-gold font-normal",
                },
              ],
            ]}
          />
        </div>

        {/* grid */}
        {loading ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
