/**
 * Cosalka · Nutragen — Scroll choreography engine
 * ------------------------------------------------
 * Pure, framework-agnostic state machine that maps the page's
 * `[data-stage]` section positions to a continuous "pose" for the 3D
 * bottle rig. Consumed once per frame by the R3F scene.
 *
 * The canvas renders ABOVE the giant typography (z-20), so the bottle is
 * the absolute protagonist — it occludes the headlines at every stage.
 *
 * Stage narrative mirrors nutragen.mx (same sections, Cosalka voice):
 *   hero     — hook "¿te engañan con tu propia piel?" (center)
 *   verdad   — sin corticoides / sin rebote (left)
 *   rutina   — doble acción paso 1 + paso 2 (center between columns)
 *   actua    — cómo actúa · exploded clinical layers (center, hotspots)
 *   origen   — la historia padre e hijo (left)
 *   esno     — qué es / qué no es (right)
 *   habitos  — cuatro hábitos (small, deep back)
 *   voces    — personas reales, resultados reales (left)
 *   gallery  — tienda · la colección (right checkout position)
 *   envios   — envíos a toda Europa y LATAM (small, back)
 *   garantia — te acompañamos 30 días (center, behind the seal)
 *   faq      — dudas medidas (right, compact)
 *   contacto — closing statement (ascends off-screen)
 */

export type StageName =
  | "hero"
  | "verdad"
  | "rutina"
  | "actua"
  | "origen"
  | "esno"
  | "habitos"
  | "voces"
  | "gallery"
  | "envios"
  | "garantia"
  | "faq"
  | "contacto";

export interface StagePose {
  /** position */
  x: number;
  y: number;
  z: number;
  /** rotation (rad) */
  rx: number;
  /** base Y rotation offset added on top of idle drift */
  ry: number;
  /** 0 → assembled · 1 → exploded clinical layers */
  explode: number;
  /** uniform scale multiplier */
  scale: number;
}

/** Shared mutable bus — zero-rerender channel between DOM scroll & R3F. */
export const scrollBus = {
  /** normalized page progress 0..1 */
  p: 0,
  /** pointer offset -1..1 (raw, unsmoothed) */
  mx: 0,
  my: 0,
};

/** Keyframe poses anchored to each stage element's start. */
export const STAGE_POSES: Record<StageName, StagePose> = {
  /*           x      y      z      rx      ry     explode scale */
  hero:     { x: 0,     y: -0.42, z: 0.85,  rx: 0.05,  ry: 0.1,  explode: 0, scale: 1 },
  verdad:   { x: -2.35, y: -0.12, z: 0.5,   rx: 0.04,  ry: 1.05, explode: 0, scale: 1.06 },
  rutina:   { x: 0,     y: -0.34, z: 0.18,  rx: 0.05,  ry: 1.85, explode: 0, scale: 0.98 },
  actua:    { x: 0,     y: -0.08, z: -0.15, rx: 0.07,  ry: 2.6,  explode: 1, scale: 1.04 },
  origen:   { x: -2.5,  y: 0.02,  z: 0.3,   rx: -0.02, ry: 3.55, explode: 0, scale: 0.92 },
  esno:     { x: 2.5,   y: -0.05, z: 0.35,  rx: -0.03, ry: 4.3,  explode: 0, scale: 0.9 },
  habitos:  { x: 0,     y: -0.55, z: -1.5,  rx: 0.08,  ry: 5.05, explode: 0, scale: 0.78 },
  voces:    { x: -2.45, y: -0.05, z: 0.45,  rx: 0.03,  ry: 5.8,  explode: 0, scale: 0.94 },
  gallery:  { x: 2.55,  y: 0.1,   z: 0.3,   rx: -0.03, ry: 6.6,  explode: 0, scale: 0.86 },
  envios:   { x: 0,     y: -0.6,  z: -1.3,  rx: 0.06,  ry: 7.35, explode: 0, scale: 0.7 },
  garantia: { x: 0,     y: -0.38, z: 0.05,  rx: 0.05,  ry: 8.15, explode: 0, scale: 0.95 },
  faq:      { x: 2.6,   y: 0.05,  z: 0.2,   rx: -0.04, ry: 8.9,  explode: 0, scale: 0.72 },
  contacto: { x: 0.9,   y: 4.6,   z: -0.5,  rx: 0.12,  ry: 9.6,  explode: 0, scale: 0.55 },
};

const POSE_KEYS: Array<keyof StagePose> = [
  "x",
  "y",
  "z",
  "rx",
  "ry",
  "explode",
  "scale",
];

/* ── internals ─────────────────────────────────────────────────────── */

let anchors: Array<{ stage: StageName; start: number }> = [];
let cleanupFns: Array<() => void> = [];

const smootherstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};

function measure() {
  if (typeof window === "undefined") return;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-stage]")
  );
  const seen = new Set<string>();
  anchors = els
    .map((el) => ({
      stage: el.dataset.stage as StageName,
      start: Math.min(1, Math.max(0, el.offsetTop / Math.max(1, docH))),
    }))
    .filter((a) => {
      if (!STAGE_POSES[a.stage] || seen.has(a.stage)) return false;
      seen.add(a.stage);
      return true;
    })
    .sort((a, b) => a.start - b.start);
}

/** Recompute breakpoints; call after mount and on layout shifts. */
export function initScrollStages(onStageChange?: (s: StageName) => void) {
  let active: StageName = "hero";

  const tick = () => {
    if (typeof window === "undefined") return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBus.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    // derive currently dominant stage (last anchor whose start is passed,
    // weighted slightly before the anchor point so transitions begin early)
    let cur: StageName = anchors.length ? anchors[0].stage : "hero";
    for (const a of anchors) {
      if (scrollBus.p >= a.start - 0.015) cur = a.stage;
    }
    if (cur !== active) {
      active = cur;
      onStageChange?.(cur);
    }
    void tickFrame();
  };

  function tickFrame() {
    /* reserved for future per-frame DOM work */
  }

  measure();
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);

  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined" && document.body) {
    ro = new ResizeObserver(measure);
    ro.observe(document.body);
  }

  cleanupFns = [
    () => window.removeEventListener("scroll", tick),
    () => window.removeEventListener("resize", measure),
    () => window.removeEventListener("load", measure),
    () => ro?.disconnect(),
  ];

  return () => cleanupFns.forEach((fn) => fn());
}

/**
 * Piecewise-smooth interpolation across stage anchors.
 * Result written into `out` (allocation-free hot path).
 */
export function samplePose(p: number, out: StagePose): StageName {
  const outStage: StageName = currentStage(p);

  if (anchors.length === 0) {
    Object.assign(out, STAGE_POSES.hero);
    return outStage;
  }

  let i = 0;
  for (let k = 0; k < anchors.length; k++) {
    if (p >= anchors[k].start) i = k;
  }
  const a = anchors[i];
  const b = anchors[Math.min(i + 1, anchors.length - 1)];
  const pa = STAGE_POSES[a.stage];
  const pb = STAGE_POSES[b.stage];

  if (a === b || pb === pa) {
    for (const k of POSE_KEYS) out[k] = pa[k];
    return outStage;
  }

  const t = smootherstep(
    (p - a.start) / Math.max(1e-5, b.start - a.start)
  );
  for (const k of POSE_KEYS) {
    out[k] = pa[k] + (pb[k] - pa[k]) * t;
  }
  return outStage;
}

export function currentStage(p: number): StageName {
  let cur: StageName = anchors.length ? anchors[0].stage : "hero";
  for (const a of anchors) if (p >= a.start - 0.02) cur = a.stage;
  return cur;
}

/* ── Viewport adapter ──────────────────────────────────────────────── */

/** Stacked-layout (mobile/tablet) recentering table per stage.
 *  dx/dy/dz added · ds multiplies scale · applied × stackT (0→1). */
const STACK_ADAPT: Record<
  StageName,
  { dx: number; dy: number; dz: number; ds: number }
> = {
  hero:     { dx: 0, dy: -0.95, dz: 0,    ds: -0.3 },
  verdad:   { dx: 0, dy: -0.78, dz: 0.3,  ds: -0.44 },
  rutina:   { dx: 0, dy: -0.55, dz: 0.1,  ds: -0.22 },
  actua:    { dx: 0, dy: 0.34,  dz: -0.9, ds: -0.1 },
  origen:   { dx: 0, dy: -0.78, dz: 0.3,  ds: -0.46 },
  esno:     { dx: 0, dy: -0.88, dz: 0.3,  ds: -0.48 },
  habitos:  { dx: 0, dy: -0.58, dz: -0.5, ds: -0.38 },
  voces:    { dx: 0, dy: 0.68,  dz: 0.35, ds: -0.4 },
  gallery:  { dx: 0, dy: 0.72,  dz: 0.3,  ds: -0.26 },
  envios:   { dx: 0, dy: 0.6,   dz: -0.3, ds: -0.2 },
  garantia: { dx: 0, dy: -0.95, dz: -0.2, ds: -0.36 },
  faq:      { dx: 0, dy: 0.7,   dz: 0.3,  ds: -0.24 },
  contacto: { dx: 0, dy: 0,     dz: 0,    ds: 0 },
};

/** Viewport-adaptive mutation: keeps the bottle composed on any width. */
export function adaptPoseToViewport(pose: StagePose, vw: number): StagePose {
  const xf = Math.min(1, Math.max(0.28, Math.pow(vw / 1260, 0.92)));
  pose.x *= xf;

  // On tablet/mobile, stacked stages recenter the bottle and shift it
  // vertically so it never covers the section's readable column.
  const stackT = Math.min(1, Math.max(0, (1080 - vw) / 420)); // 1 → fully stacked
  if (stackT <= 0) return pose;

  const a = STACK_ADAPT[currentStage(scrollBus.p)];
  const tiny = vw < 500;
  const k = tiny ? 1.08 : 1;

  pose.x *= 1 - 0.92 * stackT;
  pose.y += a.dy * stackT * k;
  pose.z += a.dz * stackT;
  pose.scale *= 1 + a.ds * stackT;

  // side stages on tiny phones float a bit higher for legibility
  if (tiny) {
    const st = currentStage(scrollBus.p);
    if (
      (st === "verdad" ||
        st === "origen" ||
        st === "voces" ||
        st === "esno" ||
        st === "gallery" ||
        st === "faq") &&
      a.dy > 0
    ) {
      pose.y += 0.35 * stackT;
    }
  }
  return pose;
}
