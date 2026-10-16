"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { frameState } from "./frame-state";

/**
 * ScribbleShells — the Mantis-style hand-scribbled sketch of the bottle.
 * A cloud of jittered, coarse wireframe lathe shells (thin black lines on
 * the clinical paper background) orbits the real glass bottle, echoing the
 * chaotic pen figure of the mantis.works reference while keeping the 3D
 * product as the crisp protagonist.
 */

const COARSE_PROFILE: Array<[number, number]> = [
  [0.02, -1.22],
  [0.5, -1.16],
  [0.63, -0.9],
  [0.64, -0.2],
  [0.58, 0.62],
  [0.36, 0.8],
  [0.21, 0.9],
  [0.205, 1.2],
  [0.02, 1.21],
];

interface Shell {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  opacity: number;
  drift: number;
}

/** Deterministic PRNG so the scribble cloud is stable across renders/HMR. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function buildShells(): Shell[] {
  const rnd = makeRng(7);
  return Array.from({ length: 12 }, () => ({
    pos: [
      (rnd() - 0.5) * 0.44,
      (rnd() - 0.5) * 0.38,
      (rnd() - 0.5) * 0.42,
    ] as [number, number, number],
    rot: [
      (rnd() - 0.5) * 0.55,
      rnd() * Math.PI * 2,
      (rnd() - 0.5) * 0.4,
    ] as [number, number, number],
    scale: 0.96 + rnd() * 0.1,
    opacity: 0.045 + rnd() * 0.062,
    drift: 0.4 + rnd() * 0.9,
  }));
}

export function ScribbleShells() {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  const geo = useMemo(
    () =>
      new THREE.LatheGeometry(
        COARSE_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
        9
      ),
    []
  );

  const shells = useMemo<Shell[]>(() => buildShells(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const e = frameState.pose.explode;
    const spread = 1 + e * 1.25;
    const k = 1 - Math.exp(-delta * 3);

    if (group.current) {
      const children = group.current.children;
      for (let i = 0; i < shells.length && i < children.length; i++) {
        const c = children[i];
        const s = shells[i];
        c.position.set(
          s.pos[0] * spread,
          s.pos[1] * spread,
          s.pos[2] * spread
        );
        c.rotation.y += delta * 0.04 * s.drift;
        const target = s.scale * (1 + e * 0.08);
        const cur = c.scale.x + (target - c.scale.x) * k;
        c.scale.setScalar(cur);
      }
    }
    if (ringA.current) {
      ringA.current.rotation.z = t * 0.12;
      const m = ringA.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.075 + Math.sin(t * 0.4) * 0.02;
    }
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.08;
      const m = ringB.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.05 + Math.cos(t * 0.3) * 0.015;
    }
  });

  return (
    <group>
      <group ref={group}>
        {shells.map((s, i) => (
          <mesh
            key={i}
            geometry={geo}
            position={s.pos}
            rotation={s.rot}
            scale={s.scale}
          >
            <meshBasicMaterial
              color="#101013"
              wireframe
              transparent
              opacity={s.opacity}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* chaotic sketch orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.25, 0.35, 0]}>
        <torusGeometry args={[2.02, 0.0042, 6, 160]} />
        <meshBasicMaterial color="#141416" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[2.48, 0.0038, 6, 160]} />
        <meshBasicMaterial color="#141416" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}
