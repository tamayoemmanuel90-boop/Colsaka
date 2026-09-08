"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { StoreCrumb } from "./StoreNav";
import { useCart } from "@/store/cart";
import { useProducts } from "@/hooks/use-products";
import { formatPrice, type ProductDTO } from "@/lib/products-client";
import {
  FREE_SHIPPING_THRESHOLD,
  formatMXN,
  STANDARD_SHIPPING,
} from "@/lib/cosalka/store";

/** Full-page cart — steppers, removal, shipping progress and summary. */
export function StoreCart() {
  const { items, setQty, remove } = useCart();
  const { products, loading } = useProducts();

  const bySlug = useMemo(() => {
    const m = new Map<string, ProductDTO>();
    products.forEach((p) => m.set(p.slug, p));
    return m;
  }, [products]);

  const lines = items
    .map((i) => ({ ...i, product: bySlug.get(i.slug) }))
    .filter((l): l is typeof l & { product: ProductDTO } => !!l.product);

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const freeProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (!loading && lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-black/20" />
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
          Tu cesta está vacía
        </h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-black/50">
          El protocolo Doble Acción te espera en formato clínico sellado de
          500 ml, con acompañamiento de 30 días.
        </p>
        <Link
          href="/tienda"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Explorar la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-32 sm:px-10 sm:pt-36">
      <StoreCrumb label="Cesta" />

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-6 text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink"
      >
        tu <span className="gold-text glow-gold">cesta.</span>
      </motion.h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* lines */}
        <ul className="space-y-4">
          {lines.map((l) => (
            <motion.li
              key={l.product.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[0_6px_24px_rgba(13,13,13,0.04)] sm:gap-6 sm:p-5"
            >
              <Link
                href={`/producto/${l.product.slug}`}
                className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl border border-black/10 bg-carbon sm:h-[104px] sm:w-[104px]"
                aria-label={`Ver ${l.product.name}`}
              >
                <img
                  src={l.product.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/producto/${l.product.slug}`}
                      className="block truncate text-left text-[14px] font-medium tracking-tight text-ink transition-colors hover:text-gold-deep sm:text-[15px]"
                    >
                      {l.product.name}
                    </Link>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-black/35">
                      {l.product.volumeMl} ml · {formatPrice(l.product.price)} c/u
                    </p>
                  </div>
                  <button
                    onClick={() => remove(l.product.slug)}
                    aria-label={`Eliminar ${l.product.name}`}
                    className="cursor-pointer rounded-full p-1.5 text-black/30 outline-none transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/60"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-black/10">
                    <button
                      onClick={() => setQty(l.product.slug, l.qty - 1)}
                      aria-label="Reducir cantidad"
                      className="grid h-8 w-8 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      className="w-8 text-center font-mono text-[12px] text-ink"
                      data-testid={`cart-qty-${l.product.slug}`}
                    >
                      {l.qty}
                    </span>
                    <button
                      onClick={() => setQty(l.product.slug, l.qty + 1)}
                      aria-label="Aumentar cantidad"
                      className="grid h-8 w-8 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="gold-text text-[16px] font-semibold tracking-tight">
                    {formatPrice(l.product.price * l.qty)}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md lg:sticky lg:top-28">
          <h2 className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-deep">
            Resumen del protocolo
          </h2>

          {/* free shipping progress */}
          <div className="mt-5 rounded-xl border border-black/[0.07] bg-paper/70 p-4">
            <p className="flex items-center gap-2 text-[11px] tracking-wide text-black/60">
              <Truck size={13} className="text-gold-deep" />
              {missing > 0 ? (
                <>
                  Te faltan{" "}
                  <span className="font-semibold text-gold-deep">
                    {formatMXN(missing)}
                  </span>{" "}
                  para envío gratis
                </>
              ) : (
                <span className="font-semibold text-gold-deep">
                  ¡Envío gratis desbloqueado!
                </span>
              )}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/[0.07]">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${freeProgress}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-2.5 text-[13px] tracking-wide">
            <div className="flex justify-between text-black/55">
              <dt>Subtotal</dt>
              <dd className="font-mono">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-black/55">
              <dt>Envío</dt>
              <dd className="font-mono">
                {shipping === 0 ? (
                  <span className="font-semibold uppercase tracking-widest text-gold-deep">
                    Gratis
                  </span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-black/[0.08] pt-3.5 text-[16px] text-ink">
              <dt className="font-medium">Total</dt>
              <dd className="gold-text glow-soft font-semibold">
                {formatPrice(subtotal + shipping)}
              </dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            data-testid="go-checkout"
            className="group relative mt-6 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_10px_36px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:shadow-[0_14px_46px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft"
          >
            Finalizar compra
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/tienda"
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-black/15 bg-transparent text-[10px] font-medium uppercase tracking-[0.24em] text-black/60 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            Seguir explorando
          </Link>

          <p className="mt-4 text-center font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/30">
            Pago cifrado · Precinto estéril · Garantía 30 días
          </p>
        </aside>
      </div>
    </div>
  );
}
