"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlowTitle } from "@/components/cosalka/GlowTitle";
import { FAQ_ITEMS } from "@/lib/cosalka/content";
import { fadeUp } from "./fade";

/** Store-level questions appended to the client's real FAQ. */
const STORE_FAQS = [
  {
    q: "¿Cómo pago mi pedido?",
    a: "Tarjeta, transferencia o contra entrega. Todo el checkout está cifrado y el total se confirma antes de pagar.",
  },
  {
    q: "¿Cuánto cuesta el envío?",
    a: "Estándar 24/72 h: gratis desde $1,500 MXN; si no, $120. Express 24 h disponible por $250.",
  },
  {
    q: "¿Puedo devolver mi frasco?",
    a: "Sí. Tienes 30 días: si sigues el protocolo y no ves resultados, te devolvemos el 100%. Sin letras chiquitas.",
  },
  {
    q: "¿De verdad son 500 ml?",
    a: "Sí. Cada unidad clínica Nutragen contiene 500 ml sellados — ningún formato de la línea es menor.",
  },
];

const ALL = [...FAQ_ITEMS, ...STORE_FAQS];

/** /faq — full clinical + store FAQ. */
export function StoreFaq() {
  const [mounted, setMounted] = useState(false);

  // Radix useId hydration guard (same pattern as the landing FAQ)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-36 sm:px-10 sm:pt-44">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
      >
        Preguntas frecuentes
      </motion.p>

      <GlowTitle
        as="h1"
        mode="mount"
        delay={0.1}
        className="mt-6 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
        lines={[
          [
            { t: "respuestas " },
            { t: "medidas.", c: "gold-text glow-gold" },
          ],
        ]}
      />

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mt-12"
      >
        {mounted ? (
          <Accordion type="single" collapsible className="w-full">
            {ALL.map((item, i) => (
              <AccordionItem key={item.q} value={`sfaq-${i}`} className="border-b border-black/10">
                <AccordionTrigger className="group cursor-pointer py-6 text-left hover:no-underline [&[data-state=open]>span.trigger-num]:text-gold-deep">
                  <span className="flex items-start gap-4 pr-4">
                    <span className="trigger-num mt-0.5 font-mono text-[10px] tracking-widest text-black/30 transition-colors duration-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-normal leading-snug tracking-wide text-ink/85 transition-colors group-hover:text-gold-deep group-data-[state=open]:text-gold-deep sm:text-base">
                      {item.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-7 pl-9 pr-2">
                  <p className="max-w-xl text-[13px] leading-relaxed text-black/55">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <ul className="w-full" aria-hidden={mounted}>
            {ALL.map((item, i) => (
              <li key={item.q} className="border-b border-black/10 py-6">
                <div className="flex items-start gap-4 pr-4">
                  <span className="mt-0.5 font-mono text-[10px] tracking-widest text-black/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[15px] font-normal leading-snug tracking-wide text-ink/85 sm:text-base">
                    {item.q}
                  </span>
                  <Plus size={16} className="mt-0.5 shrink-0 text-black/30" />
                </div>
                <p className="mt-2 hidden max-w-xl pl-9 text-[13px] leading-relaxed text-black/55 sm:block">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* contact card */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-14 flex flex-col items-center rounded-3xl border border-gold/25 bg-white/70 px-6 py-10 text-center backdrop-blur-md"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-gold-deep">
          ¿Sigues con dudas?
        </p>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-black/55">
          Escríbenos y te respondemos el mismo día — pedidos, asesoría de piel
          o distribución.
        </p>
        <Link
          href="/contacto"
          data-testid="faq-contact-cta"
          className="group mt-7 inline-flex h-12 items-center gap-2.5 rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Escríbenos
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}
