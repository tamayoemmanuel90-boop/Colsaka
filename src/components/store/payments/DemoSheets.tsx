"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Loader2, Lock, X } from "lucide-react";
import { formatPrice } from "@/lib/products-client";
import {
  ApplePayMark,
  FaceIdGlyph,
  GooglePayMark,
  VisaMark,
} from "./brand-marks";

/**
 * DEMO payment sheets — faithful recreations of the Google Pay and
 * Apple Pay checkout flows, sandboxed: no wallet SDK, no real charge.
 * Phase machine: review → processing → done (→ onDone navigates to
 * /confirmacion) with an error fallback that returns to review.
 */

export type SheetPhase = "review" | "faceid" | "processing" | "done" | "error";

export interface WalletSheetProps {
  open: boolean;
  onClose: () => void;
  /** POSTs the order, stores the receipt and clears the cart (throws on failure). */
  onPay: () => Promise<void>;
  /** Called after the success check — navigates to the confirmation page. */
  onDone: () => void;
  total: number;
  itemsLabel: string;
  customer: { name: string; city: string; state: string };
  shippingLabel: string;
  email?: string;
}

function useSheetLifecycle({
  open,
  onClose,
  onPay,
  onDone,
}: Pick<WalletSheetProps, "open" | "onClose" | "onPay" | "onDone">) {
  const [phase, setPhase] = useState<SheetPhase>("review");

  // reset to review each time the sheet opens — derived-state adjustment
  // pattern (react.dev/learn/you-might-not-need-an-effect), no effect needed
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPhase("review");
  }

  const close = useCallback(() => {
    if (phase === "processing" || phase === "done") return;
    onClose();
  }, [phase, onClose]);

  // ESC to dismiss
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, close]);

  const pay = useCallback(async () => {
    if (phase !== "review" && phase !== "faceid" && phase !== "error") return;
    setPhase("processing");
    const t0 = Date.now();
    try {
      await onPay();
      // keep the sheet visible long enough to feel like a real gateway
      const wait = Math.max(0, 1500 - (Date.now() - t0));
      window.setTimeout(() => {
        setPhase("done");
        window.setTimeout(onDone, 1150);
      }, wait);
    } catch {
      setPhase("error");
    }
  }, [phase, onPay, onDone]);

  const openFaceId = useCallback(() => {
    if (phase !== "review" && phase !== "error") return;
    setPhase("faceid");
  }, [phase]);

  return { phase, pay, close, openFaceId };
}

function SheetBackdrop({
  show,
  onClick,
  children,
  labelledBy,
}: {
  show: boolean;
  onClick: () => void;
  children: React.ReactNode;
  labelledBy: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] grid place-items-end bg-graphite/45 backdrop-blur-[4px] sm:place-items-center sm:p-6"
          onClick={onClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          data-sheet
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhaseSuccess({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#34a853]/12"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#34a853] text-white shadow-[0_8px_28px_rgba(52,168,83,.45)]">
          <Check size={20} strokeWidth={3} />
        </span>
      </motion.span>
      <p className="mt-4 text-[14px] font-medium tracking-tight text-ink">{label}</p>
      <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.22em] text-black/35">
        autorizado · sandbox
      </p>
    </div>
  );
}

function PhaseError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d93025]/10 text-[#d93025]">
        <AlertCircle size={20} />
      </span>
      <p className="mt-3.5 text-[13.5px] font-medium text-ink">No se pudo procesar el pago</p>
      <p className="mt-1 text-[11.5px] tracking-wide text-black/45">
        Revisa tu conexión e intenta de nuevo.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 h-10 cursor-pointer rounded-full border border-black/15 px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink outline-none transition-all hover:border-gold-deep hover:text-gold-deep"
      >
        Reintentar
      </button>
    </div>
  );
}

const stop = (e: React.MouseEvent) => e.stopPropagation();

/* ── Google Pay demo sheet ──────────────────────────────────────────── */

export function GooglePaySheet(props: WalletSheetProps) {
  const { open, total, itemsLabel, customer, shippingLabel } = props;
  const { phase, pay, close } = useSheetLifecycle(props);

  return (
    <SheetBackdrop show={open} onClick={close} labelledBy="gpay-sheet-title">
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={stop}
        data-testid="gpay-sheet"
        className="w-full overflow-hidden rounded-t-[22px] bg-white font-[system-ui] text-[#202124] shadow-[0_28px_90px_rgba(13,13,13,0.35)] sm:max-w-[420px] sm:rounded-[22px]"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <GooglePayMark size={19} />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.2em] text-black/35">
              <Lock size={9} /> Sandbox
            </span>
            {(phase === "review" || phase === "error") && (
              <button
                onClick={close}
                aria-label="Cerrar Google Pay"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-black/40 transition-colors hover:bg-black/[0.05] hover:text-black/70"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {phase === "done" ? (
          <PhaseSuccess label="Pago aprobado con Google Pay" />
        ) : phase === "processing" ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Loader2 size={26} className="animate-spin text-[#1a73e8]" />
            <p className="mt-4 text-[13.5px] font-medium">Procesando pago…</p>
            <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/35">
              3-D Secure · demo
            </p>
          </div>
        ) : phase === "error" ? (
          <PhaseError onRetry={pay} />
        ) : (
          <>
            <div id="gpay-sheet-title" className="px-5 pb-1 pt-5">
              <p className="text-[11px] tracking-wide text-black/45">Cosalka · Nutragen</p>
              <p className="mt-0.5 text-[26px] font-medium tracking-tight">
                {formatPrice(total)}{" "}
                <span className="text-[12px] font-normal text-black/40">MXN</span>
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-black/35">
                {itemsLabel}
              </p>
            </div>

            {/* detail rows */}
            <div className="mt-3 px-5">
              <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] py-3.5">
                <span className="text-[12.5px] text-black/55">Pagar con</span>
                <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] py-1.5 pl-2.5 pr-2 transition-colors hover:border-black/20">
                  <VisaMark size={26} />
                  <span className="text-[12.5px] font-medium">Visa ···· 4242</span>
                  <span className="rounded bg-[#1a73e8]/10 px-1.5 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-widest text-[#1a73e8]">
                    Demo
                  </span>
                  <ChevronDown size={13} className="text-black/35" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] py-3.5">
                <span className="shrink-0 text-[12.5px] text-black/55">Enviar a</span>
                <span className="truncate text-right text-[12.5px] font-medium">
                  {customer.name || "—"}
                  <span className="block text-[11px] font-normal text-black/45">
                    {[customer.city, customer.state].filter(Boolean).join(", ") || "México"}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 py-3.5">
                <span className="shrink-0 text-[12.5px] text-black/55">Envío</span>
                <span className="truncate text-right text-[12.5px] font-medium">{shippingLabel}</span>
              </div>
            </div>

            {/* pay bar */}
            <div className="px-5 pb-5 pt-2">
              <button
                onClick={pay}
                autoFocus
                data-testid="gpay-confirm"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#202124] text-white shadow-[0_10px_30px_rgba(32,33,36,.35)] outline-none transition-all hover:bg-black focus-visible:ring-2 focus-visible:ring-[#1a73e8]/50"
              >
                <GooglePayMark size={17} color="#ffffff" />
                <span className="text-[13.5px] font-medium">· Pagar</span>
              </button>
              <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-black/30">
                Pasarela demo · Google Pay sandbox — sin cargo real
              </p>
            </div>
          </>
        )}
      </motion.div>
    </SheetBackdrop>
  );
}

/* ── Apple Pay demo sheet ───────────────────────────────────────────── */

export function ApplePaySheet(props: WalletSheetProps) {
  const { open, total, itemsLabel, customer, shippingLabel, email } = props;
  const { phase, pay, close, openFaceId } = useSheetLifecycle(props);

  return (
    <SheetBackdrop show={open} onClick={close} labelledBy="apay-sheet-title">
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={stop}
        data-testid="apay-sheet"
        className="w-full overflow-hidden rounded-t-[22px] bg-[#f5f5f7] text-[#1d1d1f] shadow-[0_28px_90px_rgba(13,13,13,0.35)] sm:max-w-[420px] sm:rounded-[22px]"
        style={{ fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <ApplePayMark size={16} />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.2em] text-black/30">
              <Lock size={9} /> Sandbox
            </span>
            {(phase === "review" || phase === "error") && (
              <button
                onClick={close}
                aria-label="Cerrar Apple Pay"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-black/35 transition-colors hover:bg-black/[0.05] hover:text-black/70"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {phase === "done" ? (
          <div className="bg-[#f5f5f7]">
            <PhaseSuccess label="Pago completado" />
          </div>
        ) : phase === "processing" ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Loader2 size={26} className="animate-spin text-[#1d1d1f]/70" />
            <p className="mt-4 text-[14px] font-semibold">Procesando…</p>
            <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-black/30">
              Face ID · demo
            </p>
          </div>
        ) : phase === "faceid" ? (
          <div className="flex flex-col items-center py-11 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaceIdGlyph size={44} />
            </motion.div>
            <p className="mt-4 text-[14.5px] font-semibold">Face ID</p>
            <p className="mt-1 text-[12px] text-black/45">
              Toca dos veces el botón lateral del iPhone
            </p>
            <button
              onClick={pay}
              data-testid="apay-faceid"
              className="mt-5 h-10 cursor-pointer rounded-full bg-[#1d1d1f] px-8 text-[12px] font-medium text-white outline-none transition-transform active:scale-95"
            >
              Autenticar ahora (demo)
            </button>
          </div>
        ) : phase === "error" ? (
          <PhaseError onRetry={pay} />
        ) : (
          <>
            <div id="apay-sheet-title" className="px-5">
              <p className="text-[11px] tracking-wide text-black/40">
                Envía a <span className="font-medium text-[#1d1d1f]">{customer.name || "—"}</span>
              </p>
              <p className="mt-0.5 text-[11.5px] text-black/45">
                {[customer.city, customer.state].filter(Boolean).join(", ") || "México"}
                {email ? ` · ${email}` : ""}
              </p>
            </div>

            {/* wallet card rows */}
            <div className="mt-4 space-y-2.5 px-4">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <span className="flex items-center gap-2.5">
                  <VisaMark size={30} />
                  <span className="text-[13px] font-medium">Visa ···· 4242</span>
                  <span className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-widest text-black/40">
                    Demo
                  </span>
                </span>
                <ChevronDown size={13} className="-rotate-90 text-black/25" />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <span className="text-[13px] text-black/55">Envío</span>
                <span className="truncate text-[12.5px] font-medium">{shippingLabel}</span>
              </div>
            </div>

            {/* total */}
            <div className="flex items-baseline justify-between px-5 pb-1 pt-5">
              <span className="text-[13px] text-black/50">Paga Cosalka</span>
              <span className="text-[24px] font-semibold tracking-tight">
                {formatPrice(total)}
                <span className="ml-1 text-[11px] font-normal text-black/40">MXN</span>
              </span>
            </div>
            <p className="px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-black/30">
              {itemsLabel}
            </p>

            {/* pay bar */}
            <div className="px-5 pb-5 pt-4">
              <button
                onClick={openFaceId}
                autoFocus
                data-testid="apay-confirm"
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,.3)] outline-none transition-all hover:bg-[#111] focus-visible:ring-2 focus-visible:ring-black/40"
                aria-label={`Pagar ${formatPrice(total)} con Apple Pay`}
              >
                <ApplePayMark size={17} color="#ffffff" />
              </button>
              <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-black/30">
                Pasarela demo · Apple Pay sandbox — sin cargo real
              </p>
            </div>
          </>
        )}
      </motion.div>
    </SheetBackdrop>
  );
}
