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
 * 11 · FAQ — nutragen.mx's "Las dudas que más nos escriben".
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
    <section
      id="faq"
      data-stage="faq"
      className="relative w-full px-5 py-[16svh] sm:px-10"
    >
      <div className="mx-auto max-w-3xl">
        {/* heading — behind the drifting bottle like every headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          11 — FAQ
        </motion.p>

        <GlowTitle
          as="h2"
          delay={0.06}
          charClassName=""
          className="relative z-10 mt-7 text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.04em] text-ink"
          lines={[
            [
              { t: "las dudas que más " },
              { t: "nos escriben.", c: "gold-text glow-gold" },
            ],
          ]}
        />

        {/* accordion / static fallback — interactive layer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.12 }}
          className="pointer-events-auto relative z-30 mt-14"
        >
          {mounted ? (
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="border-b border-black/10"
                >
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
                    <p className="max-w-xl text-[13px] leading-relaxed text-black/55">
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
                  className="border-b border-black/10 py-6"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className="mt-0.5 font-mono text-[10px] tracking-widest text-black/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-normal leading-snug tracking-wide text-ink/85 sm:text-base">
                      {item.q}
                    </span>
                    <Plus size={16} className="mt-0.5 shrink-0 text-black/30" />
                  </div>
                  {/* answers remain in the SSR payload for crawlers */}
                  <p className="mt-2 hidden max-w-xl pl-9 text-[13px] leading-relaxed text-black/55 sm:block">
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
