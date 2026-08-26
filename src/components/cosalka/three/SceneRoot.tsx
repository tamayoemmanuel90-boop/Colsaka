"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { BottleRig } from "./BottleRig";
import { StudioEnv } from "./StudioEnv";
import { useSpotlightStore } from "./spotlight-store";

/** WebGL capability probe (defensive: sandbox screenshots / old GPUs). */
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

function SceneContents() {
  const hotspotId = useSpotlightStore((s) => s.activeId);
  const setActiveId = useSpotlightStore((s) => s.setActive);

  return (
    <Suspense fallback={null}>
      <StudioEnv />
      <group position={[0, -0.05, 0]}>
        <BottleRig hotspotId={hotspotId} onHotspotSelect={setActiveId} />
      </group>
    </Suspense>
  );
}

/**
 * Fixed full-viewport R3F canvas living BEHIND the page content (z-0).
 * Content sections above are `pointer-events-none` by default and re-enable
 * interaction selectively, so the canvas stays clickable wherever the DOM
 * is transparent.
 */
export function SceneRoot() {
  const [mounted, setMounted] = useState(false);
  const [glOk, setGlOk] = useState(false);

  useEffect(() => {
    // probe outside of the effect body to avoid a cascading re-render
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
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ touchAction: "pan-y" }}
    >
      {/* graceful poster while booting or without WebGL */}
      {(!mounted || !glOk) && <StaticPoster />}

      {mounted && glOk && (
        <div className="pointer-events-auto absolute inset-0">
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.12, 7], fov: 37, near: 0.1, far: 60 }}
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
            <SceneContents />
          </Canvas>
        </div>
      )}
    </div>
  );
}

/** Static luminous fallback used pre-boot or without WebGL. */
function StaticPoster() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 34% at 50% 58%, rgba(212,175,55,0.14), transparent 70%), radial-gradient(70% 55% at 50% 120%, rgba(201,206,214,0.07), transparent 60%)",
        }}
      />
    </div>
  );
}
