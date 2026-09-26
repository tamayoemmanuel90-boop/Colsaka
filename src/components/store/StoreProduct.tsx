"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlowTitle } from "@/components/cosalka/GlowTitle";
import { GARANTIA } from "@/lib/cosalka/content";
import { SHIPPING_REGIONS, FREE_SHIPPING_THRESHOLD, formatMXN, STANDARD_SHIPPING, EXPRESS_SHIPPING } from "@/lib/cosalka/store";
import { formatPrice, type ProductDTO } from "@/lib/products-client";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/store/cart";

/** Real actives + usage instructions from the client's product labels. */
const ACTIVES: Record<string, string> = {
  "paso-1-treatment":
    "Agua desmineralizada · Neem · Cola de Caballo · Ortiga · Verbena · Ácido hialurónico · Karité",
  "paso-2-moisturizer":
    "Agua desmineralizada · Aceite de coco · Oliva · Karité · Ácido hialurónico · Magnesio · Zinc",
  "paquete-doble-accion":
    "Paso 1: Neem · Cola de Caballo · Ortiga · Verbena — Paso 2: Coco · Oliva · Karité",
};

const MODO: Record<string, string> = {
  "paso-1-treatment": "Mañana · aplicar sobre piel limpia con círculos suaves.",
  "paso-2-moisturizer": "Noche · masajear hasta absorción completa.",
  "paquete-doble-accion": "Paso 1 en la mañana · Paso 2 en la noche.",
};

function MiniCard({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_10px_40px_rgba(13,13,13,0.05)] transition-[border-color] duration-300 hover:border-gold/50"
    >
      <Link
        href={`/producto/${product.slug}`}
        className="block aspect-[4/3] overflow-hidden bg-carbon"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${product.name} — 500 ml`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-center text-[14.5px] font-medium tracking-tight text-ink transition-colors group-hover:text-gold-deep">
          {product.name}
        </h3>
        <p className="gold-text glow-soft mt-3 text-center text-[20px] font-semibold leading-none">
          {formatPrice(product.price)}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/producto/${product.slug}`}
            className="flex h-9 items-center justify-center rounded-full border border-black/15 text-[9px] font-medium uppercase tracking-[0.2em] text-black/65 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            Ver detalle
          </Link>
          <button
            onClick={() => {
              add(product.slug);
              toast.success(`${product.name} añadido a la cesta`);
            }}
            data-testid={`related-buy-${product.slug}`}
            aria-label={`Añadir ${product.name} de 500 ml a la cesta`}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-gold/60 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-deep outline-none transition-all hover:bg-gold hover:text-graphite focus-visible:ring-2 focus-visible:ring-gold"
          >
            Añadir <ShoppingBag size={11} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/** /producto/[slug] — clinical product detail. */
export function StoreProduct({ slug }: { slug: string | null }) {
  const { products, loading } = useProducts();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  const product = useMemo(
    () => products.find((p) => p.slug === slug) ?? null,
    [products, slug]
  );

  if (!loading && !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <Package size={44} strokeWidth={1} className="text-black/20" />
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
          Producto no encontrado
        </h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-black/50">
          La referencia que buscas no existe en el catálogo clínico actual.
        </p>
        <Link
          href="/tienda"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Ver el catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-36 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-3xl bg-white/60" />
          <div className="space-y-5 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-3/4 animate-pulse rounded-xl bg-white/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const related = products.filter((p) => p.slug !== product.slug);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-32 sm:px-10 sm:pt-36">
      {/* breadcrumb */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-black/40"
        aria-label="Ruta de navegación"
      >
        <Link href="/tienda" className="transition-colors hover:text-gold-deep">
          Tienda
        </Link>
        <ChevronRight size={10} className="text-gold-deep" />
        <span className="text-ink/70">{product.name}</span>
      </motion.nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* image */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-carbon shadow-[0_30px_80px_rgba(13,13,13,0.18)]"
        >
          <img
            src={product.image}
            alt={`${product.name} — frasco clínico de ${product.volumeMl} ml`}
            className="aspect-[4/5] w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-5 top-5 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          <span className="absolute right-5 top-5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 font-mono text-[9px] tracking-widest text-black/60 backdrop-blur-sm">
            {product.volumeMl} ML
          </span>
        </motion.figure>

        {/* info */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-mono text-[9px] uppercase tracking-[0.32em] text-gold-deep"
          >
            {product.purity} · {product.volumeMl} ml · formato clínico
          </motion.p>

          <GlowTitle
            as="h1"
            mode="mount"
            delay={0.12}
            className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.04] tracking-[-0.035em] text-ink"
            lines={[[{ t: product.name }]]}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-3 text-[13.5px] tracking-wide text-black/50"
          >
            {product.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="gold-text glow-soft mt-6 text-[38px] font-semibold leading-none tracking-tight"
            data-testid={`pd-price-${product.slug}`}
          >
            {formatPrice(product.price)}
          </motion.p>

          {/* benefits */}
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-7 space-y-2.5"
            aria-label="Beneficios"
          >
            {product.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10">
                  <Check size={10} className="text-gold-deep" strokeWidth={2.5} />
                </span>
                <span className="text-[13px] leading-snug tracking-wide text-ink/75">{b}</span>
              </li>
            ))}
          </motion.ul>

          {/* actives */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.58 }}
            className="mt-6 rounded-xl border border-black/[0.07] bg-white/60 px-4 py-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.16em] text-black/45"
          >
            {ACTIVES[product.slug] ?? product.tagline}
          </motion.p>

          {/* qty + actions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.64 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-black/12 bg-white/70">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
                className="grid h-full w-11 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center font-mono text-[13px] text-ink" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(12, q + 1))}
                aria-label="Aumentar cantidad"
                className="grid h-full w-11 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={() => {
                add(product.slug, qty);
                toast.success(
                  `${product.name} × ${qty} · ${product.volumeMl} ml añadido a la cesta`
                );
              }}
              data-testid={`pd-add-${product.slug}`}
              className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/60 bg-transparent px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-deep outline-none transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_8px_30px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
            >
              Añadir a la cesta
              <ShoppingBag size={13} />
            </button>

            <Link
              href="/checkout"
              onClick={() => add(product.slug, qty)}
              data-testid={`pd-buy-${product.slug}`}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-7 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft"
            >
              Comprar ahora
              <Zap size={12} />
            </Link>
          </motion.div>

          {/* details accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            className="mt-9"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="desc" className="border-b border-black/10">
                <AccordionTrigger className="cursor-pointer text-left hover:no-underline">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-ink/80">
                    Descripción clínica
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="max-w-xl text-[13px] leading-relaxed text-black/55">
                    {product.description}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="modo" className="border-b border-black/10">
                <AccordionTrigger className="cursor-pointer text-left hover:no-underline">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-ink/80">
                    Modo de uso
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-black/55">
                    <Clock size={13} className="mt-0.5 shrink-0 text-gold-deep" />
                    {MODO[product.slug] ?? "Aplicar dos veces al día sobre piel limpia."}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="envio" className="border-b border-black/10">
                <AccordionTrigger className="cursor-pointer text-left hover:no-underline">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-ink/80">
                    Envíos
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-black/55">
                    <Truck size={13} className="mt-0.5 shrink-0 text-gold-deep" />
                    A todo México en 24–72 h con seguimiento. Gratis desde{" "}
                    {formatMXN(FREE_SHIPPING_THRESHOLD)}; si no, {formatMXN(STANDARD_SHIPPING)}.
                    Express 24 h por {formatMXN(EXPRESS_SHIPPING)}. {SHIPPING_REGIONS}.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="garantia" className="border-b border-black/10">
                <AccordionTrigger className="cursor-pointer text-left hover:no-underline">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-ink/80">
                    Garantía 30 días
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-black/55">
                    <ShieldCheck size={13} className="mt-0.5 shrink-0 text-gold-deep" />
                    {GARANTIA.line}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20" aria-label="Completa tu protocolo">
          <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.03em] text-ink">
            Completa tu <span className="gold-text glow-soft">protocolo.</span>
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <MiniCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
