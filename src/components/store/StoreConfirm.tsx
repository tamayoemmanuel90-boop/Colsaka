"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Package, Truck } from "lucide-react";
import { useOrderStore } from "@/store/order";
import { formatPrice } from "@/lib/products-client";
import { formatMXN } from "@/lib/cosalka/store";

/** Order confirmation — server REF + full receipt breakdown. */
export function StoreConfirm() {
  const receipt = useOrderStore((s) => s.receipt);

  if (!receipt) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <Package size={44} strokeWidth={1} className="text-black/20" />
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
          Todavía no hay pedidos
        </h1>
        <Link
          href="/tienda"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const ref = receipt.orderId.slice(0, 12).toUpperCase();
  const shipping = receipt.shipping.price;
  const totalWithShipping = receipt.total + shipping;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-5 pb-24 pt-36 text-center sm:pt-40">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 13, delay: 0.1 }}
      >
        <CheckCircle2 size={58} strokeWidth={1.1} className="text-gold-deep" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-7 text-[clamp(2rem,4.6vw,3.4rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
      >
        pedido <span className="gold-text glow-gold">confirmado.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black/45"
        data-testid="order-ref"
      >
        REF · {ref}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mt-6 max-w-md text-[13.5px] leading-relaxed tracking-wide text-black/55"
      >
        {receipt.customer.name ? `${receipt.customer.name}, tu` : "Tu"} protocolo
        Nutragen queda reservado con precinto estéril.{" "}
        {receipt.customer.city && <>Ruta de entrega hacia {receipt.customer.city}. </>}
        Recibirás la confirmación con seguimiento en tu correo.
      </motion.p>

      {/* receipt */}
      <motion.dl
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-10 w-full max-w-md space-y-3 rounded-2xl border border-black/[0.08] bg-white/80 p-6 text-left shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md"
      >
        <div className="flex justify-between text-[12.5px] text-black/55">
          <dt>Productos (protocolo)</dt>
          <dd className="font-mono">{formatPrice(receipt.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-[12.5px] text-black/55">
          <dt>Envío · {receipt.shipping.label}</dt>
          <dd className="font-mono">
            {shipping === 0 ? (
              <span className="font-semibold uppercase tracking-widest text-gold-deep">
                Gratis
              </span>
            ) : (
              formatMXN(shipping)
            )}
          </dd>
        </div>
        <div className="flex justify-between border-t border-black/[0.08] pt-3.5 text-[16px] text-ink">
          <dt className="font-medium">Total</dt>
          <dd className="gold-text glow-soft font-semibold">
            {formatMXN(totalWithShipping)}
          </dd>
        </div>
        {receipt.method && (
          <div
            className="flex justify-between border-t border-black/[0.08] pt-3 text-[12px] text-black/50"
            data-testid="order-method"
          >
            <dt>Pago</dt>
            <dd className="font-mono">{receipt.method}</dd>
          </div>
        )}
      </motion.dl>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-9 flex flex-col items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-black/40"
      >
        <span className="inline-flex items-center gap-2">
          <Truck size={12} className="text-gold-deep" /> 24/72 h con seguimiento GPS
        </span>
        <span className="inline-flex items-center gap-2">
          <Mail size={12} className="text-gold-deep" /> clinica@cosalka.com — te acompañamos 30 días
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        <Link
          href="/tienda"
          data-testid="confirm-continue"
          className="inline-flex h-12 items-center rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-black/15 bg-transparent px-9 text-[10px] font-medium uppercase tracking-[0.24em] text-black/60 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          Volver a la presentación
        </Link>
      </motion.div>
    </div>
  );
}
