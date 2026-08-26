"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/cosalka/content";

/**
 * SSR renders a static, crawlable version (questions + answers).
 * The interactive Radix accordion mounts right after hydration — this
 * sidesteps useId SSR/hydration divergence inside Radix internals while
 * keeping the FAQ fully readable and SEO-friendly.
 */
export function Faq() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="faq" className="relative w-full px-5 py-32 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
        {/* heading rail */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8 }}
            className="kicker text-gold"
          >
            FAQ · Consultorio clínico
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="mt-5 text-balance text-4xl font-light leading-tight tracking-tight text-clinic sm:text-5xl"
          >
            Preguntas, <em className="gold-text not-italic">respuestas medidas.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.16 }}
            className="mt-5 max-w-sm text-sm leading-relaxed text-white/50"
          >
            Todo lo que necesitas saber sobre la ciencia nutragenética, el
            formato clínico de 500 ml y nuestro estándar de pureza.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24, duration: 0.9 }}
            className="mt-8 hidden rounded-2xl border border-white/[0.07] bg-carbon/70 p-5 backdrop-blur-md lg:block"
          >
            <p className="kicker !text-[8.5px] text-white/35">
              ¿Otras dudas técnicas?
            </p>
            <a
              href="mailto:clinica@cosalka.com"
              className="pointer-events-auto mt-2 inline-block text-[13px] tracking-wide text-gold underline-offset-4 transition-colors hover:text-gold-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              clinica@cosalka.com
            </a>
          </motion.div>
        </div>

        {/* accordion / static fallback */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="pointer-events-auto"
        >
          {mounted ? (
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="border-b border-white/[0.08]"
                >
                  <AccordionTrigger className="group cursor-pointer py-6 text-left hover:no-underline [&[data-state=open]>span.trigger-num]:text-gold">
                    <span className="flex items-start gap-4 pr-4">
                      <span className="trigger-num mt-0.5 font-mono text-[10px] tracking-widest text-white/30 transition-colors duration-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-normal leading-snug tracking-wide text-clinic/90 transition-colors group-hover:text-gold-soft group-data-[state=open]:text-gold sm:text-base">
                        {item.q}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 pl-9 pr-2">
                    <p className="max-w-xl text-[13px] leading-relaxed text-white/50">
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <ul className="w-full" aria-hidden={mounted}>
              {FAQ_ITEMS.map((item, i) => (
                <li
                  key={item.q}
                  className="border-b border-white/[0.08] py-6"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className="mt-0.5 font-mono text-[10px] tracking-widest text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-normal leading-snug tracking-wide text-clinic/90 sm:text-base">
                      {item.q}
                    </span>
                    <Plus size={16} className="mt-0.5 shrink-0 text-white/30" />
                  </div>
                  {/* answers remain in the SSR payload for crawlers */}
                  <p className="mt-2 hidden max-w-xl pl-9 text-[13px] leading-relaxed text-white/50 sm:block">
                    {item.a}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
