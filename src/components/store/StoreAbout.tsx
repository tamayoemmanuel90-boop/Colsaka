"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { GlowTitle } from "@/components/cosalka/GlowTitle";
import { ESNO, ORIGEN, SCIENCE_STATS } from "@/lib/cosalka/content";
import { fadeUp } from "./fade";

const CERTS = [
  "HECHO EN MÉXICO",
  "NO TESTEADO EN ANIMALES",
  "TECNOLOGÍA NUTRAGENÉTICA",
];

/** /nosotros — the Cosalka International story. */
export function StoreAbout() {
  return (
    <div className="w-full">
      {/* header */}
      <header className="mx-auto w-full max-w-6xl px-5 pb-16 pt-36 sm:px-10 sm:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          Nosotros · Cosalka International
        </motion.p>

        <GlowTitle
          as="h1"
          mode="mount"
          delay={0.1}
          className="mt-6 text-[clamp(2.2rem,5.2vw,4.4rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
          lines={[
            [{ t: "padre e hijo." }],
            [{ t: "doce años", c: "gold-text glow-gold" }, { t: " de investigación." }],
          ]}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-7 max-w-xl text-[13.5px] leading-relaxed tracking-wide text-black/55"
        >
          {ORIGEN.line}
        </motion.p>
      </header>

      {/* production photo */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-10" aria-label="Producción real">
        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-black/[0.08] shadow-[0_30px_80px_rgba(13,13,13,0.15)]"
        >
          <img
            src="/images/client/produccion-real.jpg"
            alt="Producción real de las cremas Nutragen de 500 ml en México"
            loading="lazy"
            className="aspect-[16/8] w-full object-cover"
          />
          <figcaption className="border-t border-black/[0.07] bg-white/80 px-5 py-3.5 font-mono text-[8.5px] uppercase tracking-[0.26em] text-black/40 backdrop-blur-sm">
            Producción real · Cosalka México
          </figcaption>
        </motion.figure>
      </section>

      {/* timeline */}
      <section className="mx-auto w-full max-w-3xl px-5 pb-20 sm:px-10" aria-label="Historia">
        <motion.ol
          {...fadeUp}
          transition={{ duration: 0.8 }}
          className="border-t border-black/10"
        >
          {ORIGEN.timeline.map((t) => (
            <li
              key={t.year}
              className="group flex items-baseline justify-between gap-6 border-b border-black/10 py-5 transition-colors hover:bg-gold/[0.05]"
            >
              <span className="text-[13px] leading-relaxed tracking-wide text-black/55">
                {t.label}
              </span>
              <span className="gold-text glow-soft shrink-0 font-mono text-sm font-semibold tracking-tight">
                {t.year}
              </span>
            </li>
          ))}
        </motion.ol>
      </section>

      {/* science stats */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 sm:px-10" aria-label="Ciencia">
        <motion.dl
          {...fadeUp}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {SCIENCE_STATS.map((s) => (
            <div key={s.label} className="px-6 py-7 text-center">
              <dt className="gold-text glow-soft text-2xl font-semibold tracking-tight">
                {s.value}
              </dt>
              <dd className="mt-2 text-[8.5px] uppercase tracking-[0.2em] text-black/45">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* honesty block */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-10" aria-label="Honestidad clínica">
        <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="font-mono text-[9px] uppercase tracking-[0.34em] text-black/45">
          {ESNO.kicker}
        </motion.p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-ink">
          qué <span className="gold-text glow-soft">es.</span> qué no es.
        </h2>

        <div className="mt-10 grid gap-9 sm:grid-cols-2">
          {[
            { list: ESNO.es, mark: "+", tone: "text-gold-deep" },
            { list: ESNO.noEs, mark: "−", tone: "text-black/30" },
          ].map((col, ci) => (
            <motion.ul
              key={ci}
              {...fadeUp}
              transition={{ duration: 0.75, delay: ci * 0.12 }}
              className="space-y-1 border-t border-black/10"
            >
              {col.list.map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-3 border-b border-black/[0.08] py-3.5 transition-colors hover:bg-gold/[0.05]"
                >
                  <span className={`mt-0.5 font-mono text-[10px] leading-4 ${col.tone}`}>
                    {col.mark}
                  </span>
                  <span className="text-[12.5px] leading-snug tracking-wide text-ink/75 transition-colors group-hover:text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </motion.ul>
          ))}
        </div>
      </section>

      {/* brand block */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-24 sm:px-10" aria-label="La marca">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center rounded-3xl border border-gold/25 bg-white/70 px-6 py-12 text-center backdrop-blur-md"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-gold-deep">
            Una marca de Cosalka
          </p>
          <p className="mt-5 text-[14px] leading-relaxed tracking-wide text-ink/80">
            Cosalka International S. de R.L. de C.V. — nutrición aplicada a la
            piel, desarrollada y producida en México.
          </p>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label="Certificaciones">
            {CERTS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-gold/30 bg-white/60 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-gold-deep"
              >
                {c}
              </li>
            ))}
          </ul>

          <a
            href="https://www.cosalkainternational.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-black/50 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <Globe size={12} className="text-gold-deep" />
            cosalkainternational.com
          </a>

          <Link
            href="/tienda"
            data-testid="about-cta"
            className="group mt-9 inline-flex h-12 items-center gap-2.5 rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
          >
            Conoce la colección
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
