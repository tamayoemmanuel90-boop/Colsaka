"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Leaf,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { GlowTitle } from "@/components/cosalka/GlowTitle";
import { FAQ_ITEMS, RUTINA, VOCES } from "@/lib/cosalka/content";
import { formatPrice, type ProductDTO } from "@/lib/products-client";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/store/cart";

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "tratamiento", label: "Tratamiento" },
  { id: "hidratacion", label: "Hidratación" },
  { id: "protocolos", label: "Protocolos" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

function categoryOf(slug: string): CategoryId {
  if (slug === "paso-1-treatment") return "tratamiento";
  if (slug === "paso-2-moisturizer") return "hidratacion";
  return "protocolos";
}

const TRUST = [
  { icon: Truck, label: "Envío 24/72 h" },
  { icon: ShieldCheck, label: "Garantía 30 días" },
  { icon: Leaf, label: "Orgánica · no testado en animales" },
  { icon: Lock, label: "Pago cifrado" },
] as const;

const MARQUEE = [
  "TECNOLOGÍA NUTRAGENÉTICA",
  "500 ML",
  "HECHO EN MÉXICO",
  "SIN CORTICOIDES",
  "GARANTÍA 30 DÍAS",
  "DOBLE ACCIÓN",
];

function StoreCard({ product, index }: { product: ProductDTO; index: number }) {
  const add = useCart((s) => s.add);

  const quickAdd = () => {
    add(product.slug);
    toast.success(`${product.name} · ${product.volumeMl} ml añadido a la cesta`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_10px_40px_rgba(13,13,13,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-[0_28px_70px_rgba(13,13,13,0.12)]"
    >
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-carbon"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${product.name} — frasco clínico de ${product.volumeMl} ml`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 font-mono text-[9px] tracking-widest text-black/60 backdrop-blur-sm">
          {product.volumeMl} ML
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-center text-lg font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-gold-deep">
          {product.name}
        </h3>
        <p className="mt-1.5 text-center text-[11.5px] tracking-wide text-black/45">
          {product.tagline}
        </p>

        <p className="gold-text glow-soft mt-4 text-center text-[26px] font-semibold leading-none tracking-tight">
          {formatPrice(product.price)}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href={`/producto/${product.slug}`}
            data-testid={`store-detail-${product.slug}`}
            className="flex h-10 items-center justify-center rounded-full border border-black/15 bg-transparent text-[9.5px] font-medium uppercase tracking-[0.2em] text-black/65 outline-none transition-all duration-300 hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            Ver detalle
          </Link>
          <button
            onClick={quickAdd}
            data-testid={`store-buy-${product.slug}`}
            aria-label={`Comprar ${product.name} de ${product.volumeMl} mililitros`}
            className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-gold/60 bg-transparent px-4 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep outline-none transition-all duration-300 hover:bg-gold hover:text-graphite hover:shadow-[0_8px_30px_rgba(212,175,55,.4)] focus-visible:ring-2 focus-visible:ring-gold"
          >
            Añadir a la cesta
            <ShoppingBag size={12} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

/** /tienda — the complete catalog with many sections. */
export function StoreHome() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState<CategoryId>("todos");

  const filtered = useMemo(
    () =>
      cat === "todos"
        ? products
        : products.filter((p) => categoryOf(p.slug) === cat),
    [products, cat]
  );

  const bundle = products.find((p) => p.slug === "paquete-doble-accion");

  return (
    <div className="w-full">
      {/* ── header ─────────────────────────────────────────────── */}
      <header className="mx-auto w-full max-w-6xl px-5 pb-16 pt-36 sm:px-10 sm:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
        >
          Tienda oficial · Nutragen por Cosalka
        </motion.p>

        <GlowTitle
          as="h1"
          mode="mount"
          delay={0.1}
          className="mt-6 text-[clamp(2.4rem,5.6vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink"
          lines={[
            [
              { t: "la " },
              { t: "colección", c: "gold-text glow-gold" },
              { t: " completa." },
            ],
          ]}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-5 font-mono text-[9.5px] uppercase tracking-[0.3em] text-black/45"
        >
          Tecnología nutragenética · 500 ml · acompañamiento 30 días
        </motion.p>

        {/* trust strip */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label="Ventajas de la tienda"
        >
          {TRUST.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border border-black/[0.08] bg-white/70 px-4 py-3.5 backdrop-blur-sm"
            >
              <Icon size={15} className="shrink-0 text-gold-deep" strokeWidth={1.75} />
              <span className="text-[10px] uppercase leading-snug tracking-[0.14em] text-black/55">
                {label}
              </span>
            </li>
          ))}
        </motion.ul>
      </header>

      {/* ── marquee ────────────────────────────────────────────── */}
      <div
        className="overflow-hidden border-y border-black/[0.07] bg-white/50 py-3.5 backdrop-blur-sm"
        aria-hidden
      >
        <div className="marquee-track">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {MARQUEE.map((m) => (
                <span
                  key={`${half}-${m}`}
                  className="flex items-center font-mono text-[9px] uppercase tracking-[0.34em] text-black/35"
                >
                  <span className="px-7">{m}</span>
                  <span className="text-gold">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── catalog ────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-10" aria-label="Catálogo">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-ink">
            el <span className="gold-text glow-soft">catálogo.</span>
          </h2>

          {/* category chips */}
          <ul className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setCat(c.id)}
                  data-testid={`filter-${c.id}`}
                  aria-pressed={cat === c.id}
                  className={
                    "cursor-pointer rounded-full border px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold/60 " +
                    (cat === c.id
                      ? "border-gold bg-gold text-graphite shadow-[0_0_16px_rgba(212,175,55,.35)]"
                      : "border-gold/40 bg-white/70 text-gold-deep hover:bg-gold/15")
                  }
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl border border-black/[0.06] bg-white/60"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <StoreCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── bundle banner ──────────────────────────────────────── */}
      {bundle && (
        <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-10" aria-label="Paquete Doble Acción">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.75 }}
            className="grid overflow-hidden rounded-3xl bg-carbon text-white shadow-[0_30px_80px_rgba(13,13,13,0.25)] sm:grid-cols-2"
          >
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-gold-soft">
                El offer real
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                Paquete <span className="gold-text glow-gold">Doble Acción</span>
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/60">
                Paso 1 + Paso 2 — el protocolo completo de 30 días. Dos frascos
                clínicos de 500 ml, una rutina fácil de seguir.
              </p>
              <p className="mt-6 inline-flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 line-through">
                  {formatPrice(1798)}
                </span>
                <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-soft">
                  Ahorras $208 MXN
                </span>
              </p>
              <p className="gold-text glow-soft mt-3 text-4xl font-semibold tracking-tight">
                {formatPrice(bundle.price)}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    useCart.getState().add(bundle.slug);
                    toast.success("Paquete Doble Acción añadido a la cesta");
                  }}
                  data-testid="bundle-buy"
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-8 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.4)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
                >
                  Añadir el protocolo
                  <ShoppingBag size={13} />
                </button>
                <Link
                  href={`/producto/${bundle.slug}`}
                  data-testid="bundle-detail"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[10px] font-medium uppercase tracking-[0.24em] text-white/75 outline-none transition-all duration-300 hover:border-gold hover:text-gold-soft focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  Ver detalle
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] bg-black/40">
              <img
                src={bundle.image}
                alt="Paquete Doble Acción — dos frascos Nutragen de 500 ml"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* ── rutina ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-10" aria-label="La rutina">
        <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="font-mono text-[9px] uppercase tracking-[0.34em] text-black/45">
          Doble acción
        </motion.p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-ink">
          dos pasos. <span className="gold-text glow-soft">una rutina.</span>
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {RUTINA.steps.map((s, i) => (
            <motion.article
              key={s.n}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group rounded-2xl border border-black/10 bg-white/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-white/90 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-deep">
                  {s.n}
                </span>
                <span className="font-mono text-[9px] tracking-[0.26em] text-black/30">
                  500 ML
                </span>
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-black/55">{s.body}</p>
              <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">
                  {i === 0 ? "Mañana · aplicarlo limpio" : "Noche · círculos suaves"}
                </span>
                <Link
                  href={`/producto/${i === 0 ? "paso-1-treatment" : "paso-2-moisturizer"}`}
                  className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  Ver <ArrowRight size={11} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── voces ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-10" aria-label="Testimonios">
        <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="font-mono text-[9px] uppercase tracking-[0.34em] text-black/45">
          {VOCES.kicker}
        </motion.p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-ink">
          personas reales. <span className="gold-text glow-soft">resultados reales.</span>
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VOCES.items.map((v, i) => (
            <motion.figure
              key={v.name}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.11 }}
              className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-white/90"
            >
              <blockquote className="text-[13.5px] leading-relaxed tracking-wide text-ink/80">
                &ldquo;{v.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-black/10 pt-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                  {v.name}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/40">
                  {v.ctx} · {v.when}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-5 text-[10px] tracking-wide text-black/35">{VOCES.legal}</p>
      </section>

      {/* ── FAQ teaser ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 sm:px-10" aria-label="Preguntas frecuentes">
        <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="font-mono text-[9px] uppercase tracking-[0.34em] text-black/45">
          Dudas medidas
        </motion.p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-ink">
          lo que más <span className="gold-text glow-soft">nos escriben.</span>
        </h2>

        <ul className="mt-9">
          {FAQ_ITEMS.slice(0, 3).map((item, i) => (
            <motion.li
              key={item.q}
              {...fadeUp}
              transition={{ duration: 0.65, delay: i * 0.09 }}
              className="flex items-start gap-4 border-b border-black/10 py-5"
            >
              <span className="mt-0.5 font-mono text-[10px] tracking-widest text-gold-deep">
                0{i + 1}
              </span>
              <div>
                <p className="text-[14px] font-medium tracking-tight text-ink">{item.q}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/50">{item.a}</p>
              </div>
              <Check size={13} className="ml-auto mt-1 shrink-0 text-gold" />
            </motion.li>
          ))}
        </ul>

        <Link
          href="/faq"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-black/15 px-7 text-[10px] font-medium uppercase tracking-[0.24em] text-black/60 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          Ver todas las preguntas
          <ArrowRight size={12} />
        </Link>
      </section>

      {/* ── newsletter ─────────────────────────────────────────── */}
      <NewsletterBand />
    </div>
  );
}

function NewsletterBand() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email.trim())) {
      toast.error("Introduce un correo válido para recibir la guía.");
      return;
    }
    toast.success("Guía en camino — revisa tu bandeja. Sin spam.");
    setEmail("");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-10" aria-label="Guía gratuita">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.75 }}
        className="flex flex-col items-center rounded-3xl border border-gold/25 bg-white/70 px-6 py-14 text-center backdrop-blur-md"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-gold-deep">
          Guía gratuita
        </p>
        <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.6rem)] font-medium tracking-[-0.03em] text-ink">
          ¿Sigues pensando <span className="gold-text glow-gold">en tu piel?</span>
        </h2>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-black/50">
          Recibe el protocolo Domina la Psoriasis: ciencia real, hábitos y la
          rutina Doble Acción paso a paso.
        </p>

        <form
          onSubmit={subscribe}
          className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-black/15 bg-white/80 p-1.5 backdrop-blur-md focus-within:border-gold/60"
        >
          <label htmlFor="store-newsletter" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="store-newsletter"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu correo electrónico"
            className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-4 text-[12.5px] tracking-wide text-ink placeholder:text-black/35 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Recibir la guía de cuidado"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-graphite text-gold transition-colors duration-300 hover:bg-gold hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowRight size={15} />
          </button>
        </form>
        <p className="mt-4 font-mono text-[8.5px] uppercase tracking-[0.24em] text-black/35">
          Sin spam. Solo la guía y consejos de cuidado de piel.
        </p>
      </motion.div>
    </section>
  );
}
