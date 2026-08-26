"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

/**
 * Clinical nanoparticle field orbiting the bottle:
 *  · 3 tilted orbital bands of metallic micro-spheres (instanced)
 *  · drifting molecule triads
 *  · two depth layers of sparkle dust (white + gold)
 */

interface BandConfig {
  tilt: [number, number, number];
  radius: number;
  count: number;
  speed: number;
  color: string;
  size: number;
}

const BANDS: BandConfig[] = [
  { tilt: [0.42, 0.12, -0.2], radius: 1.72, count: 16, speed: 0.24, color: "#d4af37", size: 0.036 },
  { tilt: [-0.3, 0.5, 0.25], radius: 2.15, count: 14, speed: -0.17, color: "#c9ced6", size: 0.042 },
  { tilt: [0.16, -0.65, 0.1], radius: 1.55, count: 12, speed: 0.32, color: "#e8cf8f", size: 0.028 },
];

const TRIADS = [
  { radius: 1.95, y: 0.55, phase: 0.4, speed: 0.21 },
  { radius: 2.35, y: -0.7, phase: 2.6, speed: -0.13 },
  { radius: 1.62, y: 1.15, phase: 4.4, speed: 0.27 },
];

function OrbitalBand({ config }: { config: BandConfig }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: config.count }, (_, i) => ({
        angle: (i / config.count) * Math.PI * 2,
        lift: Math.sin(i * 12.9898) * 0.22,
        scale: 0.7 + ((i * 37) % 10) / 18,
      })),
    [config.count]
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * config.speed;
    for (let i = 0; i < config.count; i++) {
      const s = seeds[i];
      const a = s.angle + t;
      dummy.position.set(
        Math.cos(a) * config.radius,
        s.lift,
        Math.sin(a) * config.radius
      );
      dummy.scale.setScalar(s.scale);
      dummy.rotation.set(a * 1.7, a, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={config.tilt}>
      <instancedMesh ref={mesh} args={[undefined, undefined, config.count]} castShadow={false}>
        <sphereGeometry args={[config.size, 20, 20]} />
        <meshStandardMaterial color={config.color} metalness={0.92} roughness={0.22} envMapIntensity={1.5} />
      </instancedMesh>
    </group>
  );
}

function MoleculeTriad({ config }: { config: (typeof TRIADS)[number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime * config.speed + config.phase;
    g.current.position.set(Math.cos(t) * config.radius, config.y + Math.sin(t * 1.4) * 0.08, Math.sin(t) * config.radius);
    g.current.rotation.y = -t;
  });
  return (
    <group ref={g} scale={0.9}>
      {/* nucleus */}
      <mesh>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#e8cf8f" metalness={0.9} roughness={0.18} emissive="#d4af37" emissiveIntensity={0.16} />
      </mesh>
      {[[-0.11, 0.07, 0.04], [0.09, -0.06, 0.08], [0.03, 0.05, -0.11]].map((p, i) => (
        <mesh key={`el${i}`} position={p as unknown as THREE.Vector3Tuple}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshStandardMaterial color="#dfe6ee" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      {([[-0.11, 0.07, 0.04], [0.09, -0.06, 0.08]] as const).map((p, i) => (
        <mesh key={`bond${i}`} position={[p[0] / 2, p[1] / 2, p[2] / 2]} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...p).normalize())}>
          <cylinderGeometry args={[0.008, 0.008, Math.hypot(...p), 8]} />
          <meshStandardMaterial color="#9aa3ad" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function MolecularField() {
  return (
    <group>
      {BANDS.map((cfg, i) => (
        <OrbitalBand key={`band${i}`} config={cfg} />
      ))}
      {TRIADS.map((cfg, i) => (
        <MoleculeTriad key={`triad${i}`} config={cfg} />
      ))}

      {/* surgical white dust — far shell */}
      <Sparkles count={130} scale={[8.5, 6, 5]} size={2.1} speed={0.26} opacity={0.42} color="#EDEFF4" />
      {/* gold motes — near accent */}
      <Sparkles count={44} scale={[5.5, 4, 3]} size={3.1} speed={0.34} opacity={0.34} color="#D4AF37" />
    </group>
  );
}
