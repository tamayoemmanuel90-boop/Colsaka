/**
 * Cosalka · Nutragen — Scroll choreography engine
 * ------------------------------------------------
 * Pure, framework-agnostic state machine that maps the page's
 * `[data-stage]` section positions to a continuous "pose" for the 3D
 * bottle rig. Consumed once per frame by the R3F scene.
 *
 * Stages (DOM order):
 *   hero → spotlight (bottle left, hotspot markers)
 *        → science  (exploded clinical layers, pushed back)
 *        → gallery  (right-side checkout position, compact)
 *        → contact  (drifts away, discreet)
 */

export type StageName =
  | "hero"
  | "spotlight"
  | "science"
  | "gallery"
  | "contact";

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
  /*           x      y      z      rx     ry     explode scale */
  hero:      { x: 0,    y: -2.1,  z: -1.5,  rx: 0.06,  ry: 0.12, explode: 0, scale: 0.78 },
  spotlight: { x: -2.38, y: 0.04, z: 0.58,  rx: 0.02,  ry: 1.38, explode: 0, scale: 1.14 },
  science:   { x: -0.15, y: -0.72, z: -2.85, rx: 0.11,  ry: 2.82, explode: 1, scale: 0.74 },
  gallery:   { x: 2.5,  y: 0.52, z: 0.34,  rx: -0.05, ry: 4.4,  explode: 0, scale: 0.76 },
  contact:   { x: 4.5,  y: 1.65, z: -1.3,  rx: 0,     ry: 5.6,  explode: 0, scale: 0.42 },
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

/** Viewport-adaptive mutation: keeps the bottle composed on any width. */
export function adaptPoseToViewport(pose: StagePose, vw: number): StagePose {
  const xf = Math.min(1, Math.max(0.28, Math.pow(vw / 1260, 0.92)));
  pose.x *= xf;

  // On tablet/mobile, stacked stages shift the bottle vertically instead
  // of sideways.
  const stackT = Math.min(1, Math.max(0, (1080 - vw) / 420)); // 1 → fully stacked
  if (stackT <= 0) return pose;

  const tiny = vw < 500;

  switch (currentStage(scrollBus.p)) {
    case "spotlight":
      // recenter + lift above the copy (mobile spotlight reserves top space)
      pose.x *= 1 - 0.88 * stackT;
      pose.y += (tiny ? 1.28 : 0.98) * stackT;
      pose.z += 0.55 * stackT;
      pose.scale *= 1 - (tiny ? 0.42 : 0.3) * stackT;
      break;
    case "science":
      pose.z -= 1.1 * stackT;
      pose.y += 0.28 * stackT;
      pose.scale *= 1 - 0.14 * stackT;
      break;
    case "gallery":
      pose.x *= 1 - 0.8 * stackT;
      pose.y += 0.55 * stackT;
      pose.scale *= 1 - 0.22 * stackT;
      break;
    default:
      break;
  }
  return pose;
}
