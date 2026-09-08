/**
 * Cosalka · Nutragen — Scroll choreography engine
 * ------------------------------------------------
 * Pure, framework-agnostic state machine that maps the page's
 * `[data-stage]` section positions to a continuous "pose" for the 3D
 * bottle rig. Consumed once per frame by the R3F scene.
 *
 * STAGING LAW (hard requirement): the 3D object NEVER covers words —
 * not the giant headlines, not the title, nothing. The landing is a
 * PREVIEW: the bottle performs only for the hero moment and EXITS the
 * stage as the visitor scrolls into the value strip — it stays gone
 * for the rest of the page (gallery/cierre included).
 *
 * Preview stages:
 *   hero     — hook, text LEFT · bottle RIGHT (the only 3D moment)
 *   verdad   — value strip · bottle EXITS top-right (gone)
 *   gallery  — real-photo archive at the bottom · bottle stays off
 *   contacto — closing CTA · bottle stays off
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

/** Keyframe poses anchored to each stage element's start.
 *  LAW: hero is the only 3D moment — every later pose is OFF-STAGE. */
export const STAGE_POSES: Record<StageName, StagePose> = {
  /*           x      y      z      rx      ry     explode scale */
  hero:     { x: 2.55,  y: -0.12, z: 0.55,  rx: 0.04,  ry: 0.35, explode: 0, scale: 0.98 },
  verdad:   { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 1.15, explode: 0, scale: 0.72 },
  rutina:   { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 1.9,  explode: 0, scale: 0.72 },
  actua:    { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 2.65, explode: 0, scale: 0.72 },
  origen:   { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 3.6,  explode: 0, scale: 0.72 },
  esno:     { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 4.35, explode: 0, scale: 0.72 },
  habitos:  { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 5.1,  explode: 0, scale: 0.72 },
  voces:    { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 5.85, explode: 0, scale: 0.72 },
  gallery:  { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 6.65, explode: 0, scale: 0.72 },
  envios:   { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 7.4,  explode: 0, scale: 0.72 },
  garantia: { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 8.2,  explode: 0, scale: 0.72 },
  faq:      { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 8.95, explode: 0, scale: 0.72 },
  contacto: { x: 3.6,   y: 4.4,   z: 0.2,   rx: 0.1,   ry: 9.7,  explode: 0, scale: 0.72 },
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

/** Stacked-layout (mobile/tablet) adaptation per stage.
 *  On narrow screens the bottle always drops BELOW the reading column
 *  (words first, bottle under them) — dy/dz added · ds multiplies
 *  scale · applied × stackT (0→1). */
const STACK_ADAPT: Record<
  StageName,
  { dx: number; dy: number; dz: number; ds: number }
> = {
  hero:     { dx: 0, dy: -1.14, dz: 0.1,  ds: -0.3 },
  verdad:   { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  rutina:   { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  actua:    { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  origen:   { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  esno:     { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  habitos:  { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  voces:    { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  gallery:  { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  envios:   { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  garantia: { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  faq:      { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
  contacto: { dx: 0, dy: 0.6,   dz: 0,    ds: -0.1 },
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

  pose.x *= 1 - 0.92 * stackT;
  pose.y += a.dy * stackT;
  pose.z += a.dz * stackT;
  pose.scale *= 1 + a.ds * stackT;
  return pose;
}
