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
 * Fixed full-viewport R3F canvas living ABOVE the giant typography (z-20)
 * and BELOW the interactive chrome (nav, cards, drawer). The wrapper is
 * `pointer-events-none`, so every click passes straight through to the DOM
 * beneath — while the bottle visually occludes the headlines, making the
 * 3D product the absolute protagonist of the composition.
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
      className="pointer-events-none fixed inset-0 z-20"
      style={{ touchAction: "pan-y" }}
    >
      {/* graceful poster while booting or without WebGL */}
      {(!mounted || !glOk) && <StaticPoster />}

      {mounted && glOk && (
        <div className="pointer-events-none absolute inset-0">
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
            "radial-gradient(46% 34% at 50% 55%, rgba(212,175,55,0.16), transparent 70%), radial-gradient(70% 55% at 50% 115%, rgba(13,13,13,0.06), transparent 60%)",
        }}
      />
    </div>
  );
}
