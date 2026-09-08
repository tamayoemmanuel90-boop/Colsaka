"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  Loader2,
  Lock,
  Landmark,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { StoreCrumb } from "./StoreNav";
import { useCart } from "@/store/cart";
import { useProducts } from "@/hooks/use-products";
import { formatPrice, type ProductDTO } from "@/lib/products-client";
import { SHIPPING_OPTIONS } from "@/lib/cosalka/store";
import { useOrderStore, type OrderReceipt } from "@/store/order";

type Step = 1 | 2 | 3;
type PayMethod = "tarjeta" | "transferencia" | "contraentrega";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const EMPTY: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

const STEP_LABELS = ["Datos de envío", "Método de envío", "Pago seguro"];

function StepDots({ step }: { step: Step }) {
  return (
    <ol className="flex items-center gap-0" aria-label={`Paso ${step} de 3`}>
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = n < step;
        const active = n === step;
        return (
          <li key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={
                  "grid h-7 w-7 place-items-center rounded-full border font-mono text-[10px] transition-all duration-300 " +
                  (active
                    ? "border-gold bg-gold font-bold text-graphite shadow-[0_0_14px_rgba(212,175,55,.45)]"
                    : done
                      ? "border-gold/60 bg-gold/15 text-gold-deep"
                      : "border-black/15 bg-white/70 text-black/35")
                }
              >
                {n}
              </span>
              <span
                className={
                  "font-mono text-[8px] uppercase tracking-[0.18em] " +
                  (active ? "text-ink" : "text-black/35")
                }
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <span
                className={
                  "mx-3 mb-5 h-px w-8 sm:w-14 " +
                  (n < step ? "bg-gold/70" : "bg-black/10")
                }
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-black/12 bg-white/80 px-4 text-[13px] tracking-wide text-ink outline-none transition-all placeholder:text-black/30 focus:border-gold/70 focus:ring-2 focus:ring-gold/25";

export function StoreCheckout() {
  const { items, clear } = useCart();
  const { products, loading } = useProducts();
  const router = useRouter();
  const setReceipt = useOrderStore((s) => s.setReceipt);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<CustomerForm>(EMPTY);
  const [shipId, setShipId] = useState<"estandar" | "express">("estandar");
  const [pay, setPay] = useState<PayMethod>("tarjeta");
  const [processing, setProcessing] = useState(false);

  const bySlug = useMemo(() => {
    const m = new Map<string, ProductDTO>();
    products.forEach((p) => m.set(p.slug, p));
    return m;
  }, [products]);

  const lines = items
    .map((i) => ({ ...i, product: bySlug.get(i.slug) }))
    .filter((l): l is typeof l & { product: ProductDTO } => !!l.product);

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const ship = SHIPPING_OPTIONS.find((o) => o.id === shipId) ?? SHIPPING_OPTIONS[0];
  const shipCost = ship.price(subtotal);
  const total = subtotal + shipCost;

  const set = (k: keyof CustomerForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validStep1 =
    form.name.trim().length > 2 &&
    /.+@.+\..+/.test(form.email.trim()) &&
    form.phone.trim().length > 6 &&
    form.address.trim().length > 4 &&
    form.city.trim().length > 2 &&
    form.state.trim().length > 2 &&
    form.zip.trim().length > 3;

  const back = () => {
    if (step === 1) router.push("/carrito");
    else setStep((s) => (s - 1) as Step);
  };

  const placeOrder = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as {
        ok: boolean;
        orderId: string;
        total: number;
        currency: string;
      };
      const receipt: OrderReceipt = {
        ok: json.ok,
        orderId: json.orderId,
        total: json.total,
        currency: json.currency,
        shipping: { label: ship.label, price: shipCost },
        subtotal,
        customer: { name: form.name.trim(), city: form.city.trim() },
      };
      setReceipt(receipt);
      clear();
      router.replace("/confirmacion");
    } catch {
      toast.error(
        "No se pudo tramitar el pedido. Verifica tu conexión e intenta de nuevo."
      );
      setProcessing(false);
    }
  };

  if (!loading && lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <Truck size={44} strokeWidth={1} className="text-black/20" />
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
          No hay nada que pagar todavía
        </h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-black/50">
          Añade tu protocolo Doble Acción a la cesta y vuelve al checkout.
        </p>
        <button
          onClick={() => router.push("/tienda")}
          className="mt-8 h-12 cursor-pointer rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-32 sm:px-10 sm:pt-36">
      <StoreCrumb label="Checkout" />

      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink"
        >
          pago <span className="gold-text glow-gold">seguro.</span>
        </motion.h1>
        <StepDots step={step} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* left — steps */}
        <div>
          {step === 1 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md sm:p-8"
              aria-label="Datos de envío"
            >
              <h2 className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-deep">
                01 · ¿Dónde enviamos tu protocolo?
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="contents">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Nombre completo *
                  </span>
                  <input className={inputCls} value={form.name} onChange={set("name")} placeholder="María Escalona" autoComplete="name" data-testid="ck-name" />
                </label>
                <label className="contents">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Correo *
                  </span>
                  <input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="maria@correo.com" autoComplete="email" data-testid="ck-email" />
                </label>
                <label className="contents">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Teléfono *
                  </span>
                  <input className={inputCls} type="tel" value={form.phone} onChange={set("phone")} placeholder="+52 55 1234 5678" autoComplete="tel" />
                </label>
                <label className="contents">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Calle y número *
                  </span>
                  <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Av. Reforma 123, Depto 4" autoComplete="street-address" />
                </label>
                <label className="contents">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Ciudad *
                  </span>
                  <input className={inputCls} value={form.city} onChange={set("city")} placeholder="Ciudad de México" autoComplete="address-level2" data-testid="ck-city" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="contents">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                      Estado *
                    </span>
                    <input className={inputCls} value={form.state} onChange={set("state")} placeholder="CDMX" autoComplete="address-level1" />
                  </label>
                  <label className="contents">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                      C.P. *
                    </span>
                    <input className={inputCls} value={form.zip} onChange={set("zip")} placeholder="06600" inputMode="numeric" autoComplete="postal-code" />
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!validStep1) {
                    toast.error("Completa los campos obligatorios para continuar.");
                    return;
                  }
                  setStep(2);
                }}
                data-testid="ck-to-shipping"
                className="group mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_10px_36px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:shadow-[0_14px_46px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft sm:w-auto sm:px-10"
              >
                Continuar al envío
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md sm:p-8"
              aria-label="Método de envío"
            >
              <h2 className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-deep">
                02 · Velocidad de entrega
              </h2>
              <div className="mt-6 space-y-3" role="radiogroup" aria-label="Opciones de envío">
                {SHIPPING_OPTIONS.map((o) => {
                  const cost = o.price(subtotal);
                  const selected = shipId === o.id;
                  return (
                    <button
                      key={o.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setShipId(o.id)}
                      data-testid={`ship-${o.id}`}
                      className={
                        "flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold/60 " +
                        (selected
                          ? "border-gold/70 bg-gold/[0.07] shadow-[0_8px_30px_rgba(212,175,55,.15)]"
                          : "border-black/10 bg-white/70 hover:border-gold/40")
                      }
                    >
                      <span className="flex items-center gap-3.5">
                        <span
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full border " +
                            (selected ? "border-gold bg-gold/15 text-gold-deep" : "border-black/10 text-black/40")
                          }
                        >
                          <Truck size={15} />
                        </span>
                        <span>
                          <span className="block text-[13.5px] font-medium tracking-tight text-ink">
                            {o.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] tracking-wide text-black/45">
                            {o.detail}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[12.5px] font-semibold text-ink">
                        {cost === 0 ? (
                          <span className="text-gold-deep">GRATIS</span>
                        ) : (
                          formatPrice(cost)
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={back}
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-black/15 bg-transparent px-8 text-[10px] font-medium uppercase tracking-[0.24em] text-black/60 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  <ArrowLeft size={13} /> Volver
                </button>
                <button
                  onClick={() => setStep(3)}
                  data-testid="ck-to-payment"
                  className="group flex h-12 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_10px_36px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:shadow-[0_14px_46px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft"
                >
                  Ir al pago seguro
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md sm:p-8"
              aria-label="Pago"
            >
              <h2 className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-deep">
                03 · Método de pago
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Métodos de pago">
                {(
                  [
                    { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
                    { id: "transferencia", label: "Transferencia", icon: Landmark },
                    { id: "contraentrega", label: "Contra entrega", icon: Banknote },
                  ] as const
                ).map(({ id, label, icon: Icon }) => {
                  const selected = pay === id;
                  return (
                    <button
                      key={id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPay(id)}
                      className={
                        "flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold/60 " +
                        (selected
                          ? "border-gold/70 bg-gold/[0.07] text-gold-deep"
                          : "border-black/10 bg-white/70 text-black/45 hover:border-gold/40")
                      }
                    >
                      <Icon size={17} strokeWidth={1.75} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {pay === "tarjeta" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-4 overflow-hidden pt-6 sm:grid-cols-2"
                >
                  <label className="contents sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                      Número de tarjeta
                    </span>
                    <input className={inputCls} inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                  </label>
                  <label className="contents">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                      Vencimiento
                    </span>
                    <input className={inputCls} placeholder="MM / AA" autoComplete="cc-exp" />
                  </label>
                  <label className="contents">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                      CVV
                    </span>
                    <input className={inputCls} inputMode="numeric" placeholder="•••" autoComplete="cc-csc" />
                  </label>
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-black/30 sm:col-span-2">
                    Demostración — ningún cargo real se procesa en esta vista.
                  </p>
                </motion.div>
              )}

              {pay === "transferencia" && (
                <p className="mt-6 rounded-xl border border-black/[0.07] bg-paper/70 p-4 text-[12px] leading-relaxed tracking-wide text-black/55">
                  Al confirmar recibirás los datos CLABE de Cosalka
                  International S. de R.L. de C.V. por correo para completar la
                  transferencia. El pedido se reserva 24 h.
                </p>
              )}

              {pay === "contraentrega" && (
                <p className="mt-6 rounded-xl border border-black/[0.07] bg-paper/70 p-4 text-[12px] leading-relaxed tracking-wide text-black/55">
                  Pagas en efectivo al recibir tu paquete. Disponible solo para
                  envíos nacionales estándar; el mensajero lleva tu precinto
                  estéril sellado.
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={back}
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-black/15 bg-transparent px-8 text-[10px] font-medium uppercase tracking-[0.24em] text-black/60 outline-none transition-all hover:border-gold-deep hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  <ArrowLeft size={13} /> Volver
                </button>
                <button
                  onClick={placeOrder}
                  disabled={processing}
                  data-testid="ck-place-order"
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gold text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_10px_36px_rgba(212,175,55,.3)] outline-none transition-all duration-300 hover:shadow-[0_14px_46px_rgba(212,175,55,.5)] focus-visible:ring-2 focus-visible:ring-gold-soft disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Procesando…
                    </>
                  ) : (
                    <>
                      Confirmar pedido · {formatPrice(total)} <Lock size={11} strokeWidth={2.2} />
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </div>

        {/* right — order summary */}
        <aside className="h-fit rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md lg:sticky lg:top-28">
          <h2 className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-deep">
            Tu pedido
          </h2>
          <ul className="mt-5 space-y-3.5">
            {lines.map((l) => (
              <li key={l.product.slug} className="flex items-center gap-3.5">
                <img
                  src={l.product.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg border border-black/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium tracking-tight text-ink">
                    {l.product.name}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/35">
                    ×{l.qty} · {l.product.volumeMl} ml
                  </p>
                </div>
                <p className="font-mono text-[12px] text-ink">
                  {formatPrice(l.product.price * l.qty)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 border-t border-black/[0.08] pt-5 text-[12.5px] tracking-wide">
            <div className="flex justify-between text-black/55">
              <dt>Subtotal</dt>
              <dd className="font-mono">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-black/55">
              <dt>Envío ({ship.label.split("·")[0].trim()})</dt>
              <dd className="font-mono">
                {shipCost === 0 ? (
                  <span className="font-semibold uppercase tracking-widest text-gold-deep">Gratis</span>
                ) : (
                  formatPrice(shipCost)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-black/[0.08] pt-3.5 text-[16px] text-ink">
              <dt className="font-medium">Total</dt>
              <dd className="gold-text glow-soft font-semibold">{formatPrice(total)}</dd>
            </div>
          </dl>

          {form.name && (
            <p className="mt-5 rounded-xl border border-black/[0.07] bg-paper/70 p-3.5 text-[11px] leading-relaxed tracking-wide text-black/50">
              Enviando a <span className="font-semibold text-ink">{form.name}</span>
              {form.city && <> · {form.city}</>}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
