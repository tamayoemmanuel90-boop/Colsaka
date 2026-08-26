"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Truck } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import {
  formatPrice,
  type ProductDTO,
} from "@/lib/products-client";
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

      {/* body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-medium tracking-tight text-clinic transition-colors group-hover:text-gold-soft">
              {product.name}
            </h3>
            <p className="mt-1 text-[11.5px] leading-snug text-white/45">
              {product.tagline}
            </p>
          </div>
          <span
            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border border-white/25"
            style={{ background: product.accent, boxShadow: `0 0 10px ${product.accent}66` }}
            aria-hidden
          />
        </div>

        <p className="mt-3.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
          Pureza HPLC · {product.purity.replace(".", ",")}
        </p>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">Precio clínico</p>
            <p className="gold-text mt-0.5 text-2xl font-semibold tracking-tight">
              {formatPrice(product.price)}
            </p>
          </div>
          <button
            onClick={buy}
            data-testid={`buy-${product.slug}`}
            aria-label={`Comprar ${product.name} de ${product.volumeMl} mililitros`}
            className="pointer-events-auto flex h-11 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/45 bg-gold/[0.08] px-4 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold outline-none transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_8px_30px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
          >
            Comprar ahora
            <ShoppingBag size={12} strokeWidth={2} />
          </button>
        </div>
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.8 }}
              className="kicker text-gold"
            >
              Tienda · Colección completa en 500 ml
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.85, delay: 0.08 }}
              className="mt-5 text-balance text-4xl font-light leading-tight tracking-tight text-clinic sm:text-5xl"
            >
              La colección <em className="gold-text not-italic">Nutragen.</em>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.16 }}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm"
          >
            <Truck size={13} className="shrink-0 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
              Envío asegurado 24–48 h · Península
            </span>
          </motion.div>
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

      {/* ensures pointer events reach buttons inside this opaque section */}
      <AnimatePresence>{null}</AnimatePresence>
    </section>
  );
}
