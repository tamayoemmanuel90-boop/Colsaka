"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { ApplePayMark, GooglePayMark, MastercardMark, VisaMark } from "@/components/store/payments/brand-marks";

/**
 * TrustBar — Amazon-style reassurance strip directly under the hero.
 * Four hard promises with real payment marks; the moment a visitor
 * starts considering the buy box, the objections are already answered.
 */
const ITEMS = [
  {
    icon: <Truck size={20} strokeWidth={1.6} />,
    title: "Envío gratis desde $1,500",
    body: "24–72 h en todo México · con seguimiento GPS",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.6} />,
    title: "Garantía de 30 días",
    body: "Sin resultados · 100% de tu dinero de vuelta",
  },
  {
    icon: <Leaf size={20} strokeWidth={1.6} />,
    title: "Orgánico certificado",
    body: "Sin corticoides · sin esteroides · hecho en México",
  },
];

export function TrustBar() {
  return (
    <section aria-label="Garantías de compra" className="relative w-full px-5 sm:px-10">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.09 }}
            className="group flex items-start gap-3.5 rounded-2xl border border-black/[0.08] bg-white/80 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_16px_44px_rgba(212,175,55,0.14)]"
          >
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold-deep transition-colors duration-300 group-hover:bg-gold group-hover:text-graphite">
              {it.icon}
            </span>
            <span>
              <span className="block text-[12px] font-semibold tracking-tight text-ink">
                {it.title}
              </span>
              <span className="mt-0.5 block text-[10.5px] leading-snug tracking-wide text-black/50">
                {it.body}
              </span>
            </span>
          </motion.div>
        ))}

        {/* payment methods card with real brand marks */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.27 }}
          className="flex items-start gap-3.5 rounded-2xl border border-black/[0.08] bg-white/80 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_16px_44px_rgba(212,175,55,0.14)]"
          data-testid="trust-payments"
        >
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold-deep">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.6" />
              <path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span>
            <span className="block text-[12px] font-semibold tracking-tight text-ink">
              Pago 100% seguro
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-2.5">
              <VisaMark size={26} />
              <MastercardMark size={24} />
              <span className="rounded-md border border-black/10 bg-white px-1.5 py-1 shadow-sm">
                <GooglePayMark size={13} />
              </span>
              <span className="rounded-md border border-black/10 bg-white px-1.5 py-1 shadow-sm">
                <ApplePayMark size={12} />
              </span>
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
