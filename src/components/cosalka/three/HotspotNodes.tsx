"use client";

import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { HOTSPOTS } from "@/lib/cosalka/content";
import { useStageStore } from "@/store/stage";

/**
 * Interactive clinical hotspot nodes anchored to the 3D bottle.
 * Rendered as screen-space HTML via drei <Html>, so they track the bottle
 * through every scroll pose while remaining crisp & clickable.
 */
export function HotspotNodes({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const stage = useStageStore((s) => s.active);
  const visible = stage === "actua";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visible || !mounted) return null;

  return (
    <>
      {HOTSPOTS.map((h) => {
        const open = activeId === h.id;
        const below = h.id === "pureza" ? false : true; // cards open under the node by default
        return (
          <Html
            key={h.id}
            position={h.position}
            center
            zIndexRange={[38, 10]}
            wrapperClass="pointer-events-none"
            style={{ transition: "opacity .45s ease", opacity: visible ? 1 : 0 }}
          >
            <div className="relative">
              {/* pulse ring + core */}
              <button
                aria-label={`Ver detalle clínico: ${h.title}`}
                aria-expanded={open}
                onClick={() => onSelect(open ? null : h.id)}
                className="pointer-events-auto relative grid h-8 w-8 cursor-pointer place-items-center outline-none focus-visible:ring-2 focus-visible:ring-gold/70 rounded-full"
              >
                <span className="absolute inset-0 rounded-full border border-gold/80 ring-pulse" />
                <span className="absolute inset-[7px] rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm" />
                <span
                  className="relative block h-2 w-2 rounded-full bg-gold shadow-[0_0_14px_rgba(212,175,55,0.95)]"
                  style={{ transform: `scale(${open ? 1.5 : 1})`, transition: "transform .3s" }}
                />
              </button>

              {/* clinical info card — light paper edition */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={
                      "pointer-events-auto absolute left-1/2 z-20 w-60 max-w-[72vw] -translate-x-1/2 rounded-xl border border-black/10 bg-white/95 p-4 text-left shadow-[0_18px_60px_rgba(13,13,13,0.18)] backdrop-blur-md " +
                      (below ? "top-[calc(100%+12px)]" : "bottom-[calc(100%+12px)]")
                    }
                    role="dialog"
                    aria-label={h.title}
                  >
                    <p className="kicker !text-[9px] text-gold-deep">Dato clínico</p>
                    <h4 className="mt-1.5 text-[13px] font-medium tracking-wide text-ink">
                      {h.title}
                    </h4>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-black/55">
                      {h.body}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2 border-t border-black/10 pt-2.5">
                      <span className="gold-text text-lg font-semibold tracking-tight">
                        {h.stat}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-black/40">
                        {h.statLabel}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* connecting tick */}
              <span className="absolute left-1/2 top-full h-4 w-px -translate-x-1/2 bg-gradient-to-b from-gold/70 to-transparent" />
            </div>
          </Html>
        );
      })}
    </>
  );
}
