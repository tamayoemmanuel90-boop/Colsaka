"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Globe, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { GlowTitle } from "@/components/cosalka/GlowTitle";
import { ENVIOS } from "@/lib/cosalka/content";
import { fadeUp } from "./fade";

const SUBJECTS = ["Pedido", "Asesoría de piel", "Distribución", "Prensa"] as const;

const INFO = [
  { icon: Mail, label: "Correo", value: "clinica@cosalka.com" },
  { icon: Clock, label: "Horario", value: "Lun–Sáb · 9:00–19:00 CST" },
  { icon: Globe, label: "Cobertura", value: ENVIOS.regiones },
  {
    icon: MapPin,
    label: "Casa matriz",
    value: "Cosalka International S. de R.L. de C.V. — Hecho en México",
  },
] as const;

const inputCls =
  "h-11 w-full rounded-xl border border-black/12 bg-white/80 px-4 text-[13px] tracking-wide text-ink outline-none transition-all placeholder:text-black/30 focus:border-gold/70 focus:ring-2 focus:ring-gold/25";

/** /contacto — clinical contact + channels. */
export function StoreContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("Pedido");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length <= 2 || !/.+@.+\..+/.test(email.trim()) || message.trim().length <= 8) {
      toast.error("Completa nombre, correo válido y un mensaje de al menos unas palabras.");
      return;
    }
    toast.success("Mensaje enviado — te respondemos hoy mismo.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-36 sm:px-10 sm:pt-44">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
      >
        Contacto · respuesta el mismo día
      </motion.p>

      <GlowTitle
        as="h1"
        mode="mount"
        delay={0.1}
        className="mt-6 text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
        lines={[
          [{ t: "hablemos " }],
          [{ t: "de tu piel.", c: "gold-text glow-gold" }],
        ]}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* form */}
        <motion.form
          {...fadeUp}
          transition={{ duration: 0.75 }}
          onSubmit={submit}
          className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_10px_40px_rgba(13,13,13,0.05)] backdrop-blur-md sm:p-8"
          aria-label="Formulario de contacto"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                Nombre *
              </span>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                data-testid="ct-name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
                Correo *
              </span>
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                data-testid="ct-email"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
              Asunto
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number])}
              className={`${inputCls} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22><path d=%22M1 1l4 4 4-4%22 stroke=%22%23141416%22 fill=%22none%22 stroke-width=%221.4%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
              aria-label="Asunto del mensaje"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-black/45">
              Mensaje *
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntanos cómo podemos acompañarte — tu rutina, tu tipo de piel, tu pedido…"
              className="min-h-[130px] w-full rounded-xl border border-black/12 bg-white/80 px-4 py-3 text-[13px] leading-relaxed tracking-wide text-ink outline-none transition-all placeholder:text-black/30 focus:border-gold/70 focus:ring-2 focus:ring-gold/25"
              data-testid="ct-message"
            />
          </label>

          <button
            type="submit"
            data-testid="ct-send"
            className="group mt-6 inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-full bg-gold px-9 text-[10.5px] font-semibold uppercase tracking-[0.26em] text-graphite shadow-[0_14px_44px_rgba(212,175,55,.35)] outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-soft"
          >
            Enviar mensaje
            <Send size={12} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </button>

          <p className="mt-4 text-[10.5px] tracking-wide text-black/35">
            No sustituimos a tu dermatólogo: te acompañamos entre consultas.
          </p>
        </motion.form>

        {/* info cards */}
        <div className="space-y-4">
          {INFO.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-black/[0.08] bg-white/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10">
                <Icon size={15} className="text-gold-deep" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block font-mono text-[8.5px] uppercase tracking-[0.26em] text-black/40">
                  {label}
                </span>
                <span className="mt-1 block text-[12.5px] leading-snug tracking-wide text-ink/80">
                  {value}
                </span>
              </span>
            </motion.div>
          ))}

          <motion.a
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.45 }}
            href="mailto:clinica@cosalka.com"
            className="group flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/[0.07] p-5 outline-none transition-all duration-300 hover:bg-gold/[0.13] focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-gold-deep">
              Respuesta el mismo día
            </span>
            <ArrowRight size={14} className="text-gold-deep transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
