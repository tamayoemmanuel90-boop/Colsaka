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
import { GlowTitle } from "./GlowTitle";

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
    <section id="faq" className="relative w-full px-5 py-36 sm:px-10">
      <div className="mx-auto max-w-3xl">
        {/* heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8 }}
          className="kicker !text-[9px] text-gold/80"
        >
          04 · FAQ
        </motion.p>

        <GlowTitle
          as="h2"
          delay={0.06}
          className="mt-5 text-balance text-4xl font-light leading-[1.08] tracking-[-0.02em] text-clinic sm:text-5xl"
          lines={[
            [
              { t: "Preguntas, " },
              {
                t: "respuestas medidas.",
                c: "gold-text glow-gold font-normal",
              },
            ],
          ]}
        />

        {/* accordion / static fallback */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.12 }}
          className="pointer-events-auto mt-14"
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
