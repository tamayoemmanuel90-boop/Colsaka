"use client";

import { motion } from "framer-motion";
import { ESNO } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 05 · Qué es / qué no es — nutragen.mx's honesty block.
 * Copy column LEFT; the bottle performs on the RIGHT.
 * Two hairline lists: what Nutragen is, and what it will never be.
 */
export function EsNoEs() {
  return (
    <section
      id="esno"
      data-stage="esno"
      className="relative flex min-h-[104svh] w-full items-center px-5 py-[12svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-start lg:pr-8">
          <SectionHead
            kicker={ESNO.kicker}
            lines={[
              [{ t: "qué " }, { t: "es.", c: "gold-text glow-gold" }],
              [{ t: "qué no es." }],
            ]}
          />

          {/* lists — interactive layer */}
          <div className="pointer-events-auto relative z-30 mt-12 grid w-full max-w-lg gap-8 sm:grid-cols-2">
            {[ESNO.es, ESNO.noEs].map((list, col) => (
              <motion.ul
                key={col}
                {...fade}
                transition={{ duration: 0.8, delay: 0.15 + col * 0.14 }}
                className="space-y-1 border-t border-black/10"
              >
                {list.map((item, i) => (
                  <li
                    key={item}
                    className="group flex items-start gap-3 border-b border-black/[0.08] py-3 transition-colors hover:bg-gold/[0.05]"
                  >
                    <span
                      className={
                        "mt-0.5 font-mono text-[10px] leading-4 " +
                        (col === 0 ? "text-gold-deep" : "text-black/30")
                      }
                    >
                      {col === 0 ? "+" : "−"}
                    </span>
                    <span className="text-[12.5px] leading-snug tracking-wide text-ink/75 transition-colors group-hover:text-ink">
                      {item}
                    </span>
                    <span className="sr-only">{`(${i + 1})`}</span>
                  </li>
                ))}
              </motion.ul>
            ))}
          </div>
        </div>

        {/* right half — the protagonist performs here */}
        <div aria-hidden className="hidden lg:block" />
      </div>
    </section>
  );
}
