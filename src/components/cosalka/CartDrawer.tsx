"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, type ProductDTO } from "@/lib/products-client";
import { lockScroll } from "@/hooks/use-smooth-scroll";

type Phase = "cart" | "processing" | "done";

interface OrderResult {
  ok: boolean;
  orderId: string;
  total: number;
}

export function CartDrawer({
  products,
}: {
  products: ProductDTO[];
}) {
  const { items, open, setOpen, setQty, remove, clear } = useCart();
  const [phase, setPhase] = useState<Phase>("cart");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bySlug = useMemo(() => {
    const map = new Map<string, ProductDTO>();
    products.forEach((p) => map.set(p.slug, p));
    return map;
  }, [products]);

  const lines = items
    .map((i) => ({ ...i, product: bySlug.get(i.slug) }))
    .filter((l): l is typeof l & { product: ProductDTO } => !!l.product);

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      // reset transient state after close animation
      const t = setTimeout(() => {
        setPhase("cart");
        setResult(null);
        setError(null);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const checkout = async () => {
    setPhase("processing");
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as OrderResult;
      setResult(json);
      setPhase("done");
      clear();
    } catch {
      setError("No se pudo tramitar el pedido. Reintenta en unos segundos.");
      setPhase("cart");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-graphite/35 backdrop-blur-[3px]"
          />

          {/* panel */}
          <motion.aside
            role="dialog"
            aria-label="Cesta clínica Cosalka"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 27, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-md flex-col border-l border-black/10 bg-[#f6f6f8]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5">
              <div>
                <p className="kicker text-gold-deep">Cesta clínica</p>
                <p className="mt-1 text-sm tracking-wide text-black/50">
                  {lines.length}{" "}
                  {lines.length === 1
                    ? "formulación seleccionada"
                    : "formulaciones seleccionadas"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar cesta"
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-black/10 text-black/60 outline-none transition-all hover:border-gold/60 hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                <X size={15} />
              </button>
            </div>

            {/* body */}
            {phase === "done" && result ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 14 }}
                >
                  <CheckCircle2 size={54} strokeWidth={1.2} className="text-gold-deep" />
                </motion.div>
                <h3 className="mt-6 text-xl font-light tracking-wide text-ink">
                  Pedido confirmado
                </h3>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
                  REF · {result.orderId.slice(0, 12).toUpperCase()}
                </p>
                <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-black/50">
                  Tu unidad clínica de 500 ml queda reservada. Recibirás el
                  pasaporte digital del lote y la confirmación con seguimiento
                  en tu correo.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-9 h-12 cursor-pointer rounded-full border border-gold/60 bg-transparent px-8 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-deep outline-none transition-all hover:bg-gold hover:text-graphite focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  Seguir explorando
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={44} strokeWidth={1} className="text-black/20" />
                <p className="mt-6 text-[15px] tracking-wide text-black/55">
                  Tu cesta está vacía.
                </p>
                <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-black/35">
                  La colección Nutragen completa te espera en formato clínico
                  sellado de 500 ml.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="pointer-events-auto mt-8 h-11 cursor-pointer rounded-full border border-gold/60 px-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-deep outline-none transition-all hover:bg-gold hover:text-graphite focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  Ver colección
                </button>
              </div>
            ) : (
              <>
                {/* lines */}
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.product.slug}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_6px_24px_rgba(13,13,13,0.04)]"
                      >
                        <img
                          src={l.product.image}
                          alt=""
                          className="h-[74px] w-[74px] shrink-0 rounded-xl border border-black/10 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-[13.5px] font-medium tracking-tight text-ink">
                                {l.product.name}
                              </p>
                              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-black/35">
                                {l.product.volumeMl} ml · {l.product.purity.replace(".", ",")} pureza
                              </p>
                            </div>
                            <button
                              onClick={() => remove(l.product.slug)}
                              aria-label={`Eliminar ${l.product.name}`}
                              className="cursor-pointer rounded-full p-1 text-black/30 outline-none transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/60"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {/* stepper */}
                            <div className="inline-flex items-center overflow-hidden rounded-full border border-black/10">
                              <button
                                onClick={() => setQty(l.product.slug, l.qty - 1)}
                                aria-label="Reducir cantidad"
                                className="grid h-7 w-7 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center font-mono text-[11px] text-ink" data-testid={`qty-${l.product.slug}`}>
                                {l.qty}
                              </span>
                              <button
                                onClick={() => setQty(l.product.slug, l.qty + 1)}
                                aria-label="Aumentar cantidad"
                                className="grid h-7 w-7 cursor-pointer place-items-center text-black/55 outline-none transition-colors hover:bg-black/[0.05] hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/60"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <p className="text-[13px] font-semibold tracking-tight text-ink">
                              {formatPrice(l.product.price * l.qty)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* summary */}
                <div className="border-t border-black/[0.08] px-6 py-5">
                  <dl className="space-y-2 text-[12.5px] tracking-wide">
                    <div className="flex justify-between text-black/50">
                      <dt>Subtotal</dt>
                      <dd className="font-mono">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-black/50">
                      <dt>Envío térmico asegurado</dt>
                      <dd className="font-medium uppercase tracking-widest text-gold-deep">
                        Incluido
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-black/[0.08] pt-3 text-[15px] text-ink">
                      <dt>Total</dt>
                      <dd className="gold-text font-semibold">{formatPrice(subtotal)}</dd>
                    </div>
                  </dl>

                  {error && (
                    <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={checkout}
                    disabled={phase === "processing"}
                    data-testid="checkout"
                    className="group relative mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.28em] text-graphite shadow-[0_10px_36px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:shadow-[0_14px_46px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft disabled:opacity-70 disabled:hover:shadow-none"
                  >
                    {phase === "processing" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Procesando…
                      </>
                    ) : (
                      <>
                        Tramitar pedido seguro
                        <Lock size={11} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/30">
                    Pago cifrado · Precinto estéril garantizado
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
