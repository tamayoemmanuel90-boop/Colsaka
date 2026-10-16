"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { makeLabelTexture } from "./make-label-texture";
import { StudioEnv } from "./StudioEnv";

/**
 * GlbBottle — the CLIENT'S real 3D bottle mesh (white_mesh.glb, Y-up,
 * height ≈ 1.96, radius ≈ 0.32) upgraded from a raw blank white mesh to
 * the finished Nutragen product:
 *   · satin-white body (#f6f4ef, clearcoat + sheen) — the real product shell
 *   · printed front/back label — the REAL Nutragen artwork via
 *     makeLabelTexture(), cylindrical UVs mapped onto the mesh itself
 *   · brushed gold cap (#d4af37) + darker gold seal collar — brand accent
 * Motion: cinematic entrance rise + swing, idle float, pointer parallax,
 * soft contact shadow. Falls back to a static gold aura without WebGL.
 */

/* ── split thresholds in model space (GLB y ∈ [-1.001, 0.961]) ──────── */
const CAP_Y = 0.615; // above → gold cap/neck zone
const LABEL_MIN = -0.42; // printed label band
const LABEL_MAX = 0.02;
const ARC = 0.975; // ± radians of printed arc (front & back)

interface BottleSplit {
  body: THREE.BufferGeometry | null;
  cap: THREE.BufferGeometry | null;
  front: THREE.BufferGeometry | null;
  back: THREE.BufferGeometry | null;
}

/**
 * Taubin λ|μ smoothing — the client's raw scan-like mesh carries organic
 * surface noise that reads as crumpled foil under studio lighting. A few
 * alternating λ (+shrink) / μ (−shrink) passes melt the noise away while
 * preserving volume, then normals are recomputed for a clean satin shell.
 */
function smoothGeometry(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const src = geo.getAttribute("position") as THREE.BufferAttribute | undefined;
  if (!src) return geo;
  const n = src.count;
  const index = geo.getIndex();
  if (!index) return geo;

  // vertex adjacency from triangles
  const adj: number[][] = Array.from({ length: n }, () => []);
  const push = (a: number, b: number) => {
    if (!adj[a].includes(b)) adj[a].push(b);
  };
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    push(a, b); push(a, c); push(b, a); push(b, c); push(c, a); push(c, b);
  }

  let arr = new Float32Array(src.array as ArrayLike<number>);
  const step = (lambda: number) => {
    const out = new Float32Array(arr);
    for (let i = 0; i < n; i++) {
      const nb = adj[i];
      if (nb.length === 0) continue;
      let sx = 0, sy = 0, sz = 0;
      for (let k = 0; k < nb.length; k++) {
        const j = nb[k] * 3;
        sx += arr[j];
        sy += arr[j + 1];
        sz += arr[j + 2];
      }
      sx /= nb.length;
      sy /= nb.length;
      sz /= nb.length;
      const b = i * 3;
      out[b] = arr[b] + lambda * (sx - arr[b]);
      out[b + 1] = arr[b + 1] + lambda * (sy - arr[b + 1]);
      out[b + 2] = arr[b + 2] + lambda * (sz - arr[b + 2]);
    }
    arr = out;
  };

  for (let it = 0; it < 24; it++) {
    step(0.52); // shrink pass
    step(-0.53); // expand pass — Taubin volume preservation
  }

  const smoothed = new THREE.BufferAttribute(arr, src.itemSize);
  geo.setAttribute("position", smoothed);
  return geo;
}

function splitBottleGeometry(src: THREE.BufferGeometry): BottleSplit {
  const geo = smoothGeometry(src.clone());
  if (!geo.getAttribute("normal")) geo.computeVertexNormals();
  const pos = geo.getAttribute("position");
  const normal = geo.getAttribute("normal");
  const index = geo.getIndex();
  if (!index || !pos) return { body: geo, cap: null, front: null, back: null };

  const body: number[] = [];
  const cap: number[] = [];
  const front: number[] = [];
  const back: number[] = [];

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    const y = (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3;

    if (y > CAP_Y) {
      cap.push(a, b, c);
      continue;
    }
    if (y >= LABEL_MIN && y <= LABEL_MAX) {
      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;
      const cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
      const theta = Math.atan2(cx, cz);
      if (Math.abs(theta) <= ARC) {
        front.push(a, b, c);
        continue;
      }
      if (Math.abs(theta) >= Math.PI - ARC) {
        back.push(a, b, c);
        continue;
      }
    }
    body.push(a, b, c);
  }

  const makePart = (tris: number[], uvMode?: "front" | "back") => {
    if (tris.length === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", pos);
    if (normal) g.setAttribute("normal", normal);
    g.setIndex(tris);
    if (uvMode) {
      // UVs are indexed BY VERTEX (vi), not by index-array position —
      // u,v are pure functions of the vertex position, so shared
      // vertices always resolve to the same texel.
      const uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < tris.length; i++) {
        const vi = tris[i];
        const x = pos.getX(vi);
        const y = pos.getY(vi);
        const z = pos.getZ(vi);
        let th = Math.atan2(x, z);
        if (uvMode === "back") th = th > 0 ? th - Math.PI : th + Math.PI;
        const u = (th + ARC) / (2 * ARC);
        const v = (y - LABEL_MIN) / (LABEL_MAX - LABEL_MIN);
        uv[vi * 2] = u;
        uv[vi * 2 + 1] = v;
      }
      g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    }
    return g;
  };

  return {
    body: makePart(body),
    cap: makePart(cap),
    front: makePart(front, "front"),
    back: makePart(back, "back"),
  };
}

/* ── the bottle ─────────────────────────────────────────────────────── */

function BottleModel() {
  const { scene } = useGLTF("/models/white_mesh.glb");

  const split = useMemo<BottleSplit>(() => {
    let src: THREE.BufferGeometry | undefined;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!src && m.isMesh) src = m.geometry;
    });
    return src ? splitBottleGeometry(src) : { body: null, cap: null, front: null, back: null };
  }, [scene]);

  const labelTex = useMemo(() => makeLabelTexture(), []);
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const init = useRef(false);
  const { viewport } = useThree();

  const wide = viewport.width > 5.2; // desktop: bottle docks to the right column

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 3.2);

    if (!init.current) {
      init.current = true;
      g.rotation.y = -0.55;
      g.position.y = -0.44;
    }

    const intro = Math.min(1, t / 1.9);
    const ei = 1 - Math.pow(1 - intro, 3); // easeOutCubic

    const targetY = -0.55 * (1 - ei) + mouse.current.x * 0.16 + Math.sin(t * 0.21) * 0.05;
    const targetX = mouse.current.y * 0.05 + (1 - ei) * 0.18;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;

    const dockX = wide ? Math.min(viewport.width * 0.215, 1.5) : 0;
    const floatY = Math.sin(t * 0.8) * 0.045;
    const liftY = wide ? 0 : 0.92;
    g.position.x += (dockX - g.position.x) * k;
    g.position.y += (-0.42 * (1 - ei) + floatY + liftY - g.position.y) * k;
  });

  return (
    <group ref={group} scale={wide ? 1 : 0.74}>
      {split.body && (
        <mesh geometry={split.body} renderOrder={1}>
          <meshPhysicalMaterial
            color="#f6f4ef"
            roughness={0.34}
            metalness={0}
            clearcoat={0.5}
            clearcoatRoughness={0.32}
            sheen={0.35}
            sheenColor="#ffffff"
            envMapIntensity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {split.cap && (
        <mesh geometry={split.cap} renderOrder={1}>
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.27}
            envMapIntensity={1.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* gold seal collar hiding the cap/body seam */}
      <mesh position={[0, 0.615, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
        <torusGeometry args={[0.19, 0.014, 16, 72]} />
        <meshStandardMaterial color="#b8912e" metalness={1} roughness={0.32} envMapIntensity={1.3} />
      </mesh>

      {split.front && (
        <mesh geometry={split.front} renderOrder={2}>
          <meshStandardMaterial map={labelTex} roughness={0.42} metalness={0.02} envMapIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
      {split.back && (
        <mesh geometry={split.back} renderOrder={2}>
          <meshStandardMaterial map={labelTex} roughness={0.42} metalness={0.02} envMapIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ── public stage ───────────────────────────────────────────────────── */

/** Contact shadow that follows the bottle's mobile lift / desktop dock. */
function BottleShadow() {
  const { viewport } = useThree();
  const wide = viewport.width > 5.2;
  return (
    <ContactShadows
      position={[0, wide ? -1.16 : 0.05, 0]}
      opacity={wide ? 0.44 : 0.22}
      scale={wide ? 3.4 : 2.4}
      blur={2.6}
      far={2.4}
      resolution={256}
      color="#000000"
      frames={1}
    />
  );
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/** Static gold-aura fallback used pre-boot or without WebGL. */
function GlowFallback() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 34% at 62% 52%, rgba(212,175,55,0.16), transparent 70%), radial-gradient(70% 55% at 50% 115%, rgba(246,244,239,0.05), transparent 60%)",
        }}
      />
    </div>
  );
}

export function GlbBottleStage() {
  const [mounted, setMounted] = useState(false);
  const [glOk, setGlOk] = useState(false);

  useEffect(() => {
    let alive = true;
    const raf = requestAnimationFrame(() => {
      if (!alive) return;
      setGlOk(hasWebGL());
      setMounted(true);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ touchAction: "pan-y" }}>
      {(!mounted || !glOk) && <GlowFallback />}

      {mounted && glOk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0"
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.05, 6.2], fov: 32, near: 0.1, far: 60 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <Suspense fallback={null}>
              <StudioEnv />
              <BottleModel />
              <BottleShadow />
            </Suspense>
          </Canvas>
        </motion.div>
      )}
    </div>
  );
}

useGLTF.preload("/models/white_mesh.glb");
