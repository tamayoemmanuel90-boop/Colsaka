"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { makeLabelTexture } from "./make-label-texture";
import { frameState } from "./frame-state";

/**
 * Procedural Cosalka · NUTRAGEN 500 ml bottle — faithful to the REAL
 * client product: opaque satin-white body, brushed chrome cap, silver
 * seal collar and the printed COSALKA/NUTRAGEN label. Parts are grouped
 * so a scroll-driven "explode" factor can separate the clinical layers:
 * chrome cap ↑ · silver collar ↑ · the white shell turns translucent to
 * reveal the nutragenetic helix core at the center.
 */

/* ── profiles ───────────────────────────────────────────────────────── */

function buildGlassProfile(): THREE.Vector2[] {
  const p: Array<[number, number]> = [
    [0.001, -1.24],
    [0.3, -1.23],
    [0.52, -1.18],
    [0.6, -1.07],
    [0.63, -0.92],
    [0.64, -0.55],
    [0.64, -0.1],
    [0.64, 0.42],
    [0.6, 0.58],
    [0.5, 0.7],
    [0.36, 0.79],
    [0.26, 0.845],
    [0.215, 0.89],
    [0.207, 0.98],
    [0.205, 1.13],
    [0.222, 1.15],
    [0.225, 1.2],
    [0.21, 1.215],
    [0.19, 1.218],
    [0.186, 1.02],
    [0.001, 1.01],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

/* ── nutragenetic double helix core ─────────────────────────────────── */

interface HelixData {
  strandA: THREE.TubeGeometry;
  strandB: THREE.TubeGeometry;
  rungs: { pos: THREE.Vector3; quat: THREE.Quaternion; len: number }[];
}

function buildHelix(): HelixData {
  const makeStrand = (phase: number) => {
    const pts: THREE.Vector3[] = [];
    const turns = 2.1;
    for (let i = 0; i <= 90; i++) {
      const t = i / 90;
      const ang = phase + t * Math.PI * 2 * turns;
      const r = 0.155 + Math.sin(t * Math.PI) * 0.16;
      pts.push(new THREE.Vector3(Math.cos(ang) * r, -0.85 + t * 1.3, Math.sin(ang) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, 0.022, 10, false);
  };

  const rungs: HelixData["rungs"] = [];
  const turns = 2.1;
  const steps = 11;
  for (let k = 1; k < steps; k++) {
    const t = k / steps;
    const ang = t * Math.PI * 2 * turns;
    const r = 0.155 + Math.sin(t * Math.PI) * 0.16;
    const a = new THREE.Vector3(Math.cos(ang) * r, -0.85 + t * 1.3, Math.sin(ang) * r);
    const b = new THREE.Vector3(
      Math.cos(ang + Math.PI) * r,
      -0.85 + t * 1.3,
      Math.sin(ang + Math.PI) * r
    );
    const dir = new THREE.Vector3().subVectors(b, a);
    rungs.push({
      pos: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      ),
      len: dir.length(),
    });
  }

  return { strandA: makeStrand(0), strandB: makeStrand(Math.PI), rungs };
}

/* ── component ──────────────────────────────────────────────────────── */

export function Bottle() {
  const capRef = useRef<THREE.Group>(null);
  const collarRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const ridgeMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const helixGroup = useRef<THREE.Group>(null);
  const helixMatA = useRef<THREE.MeshStandardMaterial>(null);
  const ringInner = useRef<THREE.Mesh>(null);
  const ringOuter = useRef<THREE.Mesh>(null);

  const labelTex = useMemo(() => makeLabelTexture(), []);
  const glassGeo = useMemo(() => new THREE.LatheGeometry(buildGlassProfile(), 96), []);
  const helix = useMemo(() => buildHelix(), []);

  // thin open cylinder band that carries the label texture (front & back)
  const labelBand = useMemo(() => {
    const theta = 1.95; // radians — arc ≈ 1.26 world units wide
    // thetaStart = -theta/2 → the band is CENTERED on the front (+z) face
    return new THREE.CylinderGeometry(
      0.647,
      0.647,
      0.9,
      80,
      1,
      true,
      -theta / 2,
      theta
    );
  }, []);

  useFrame((state, delta) => {
    const e = frameState.pose.explode;
    const t = state.clock.elapsedTime;

    const ease = (target: number, current: number) =>
      current + (target - current) * (1 - Math.exp(-delta * 4));

    if (capRef.current)
      capRef.current.position.y = ease(1.41 + e * 1.15, capRef.current.position.y);
    if (collarRef.current)
      collarRef.current.position.y = ease(1.185 + e * 0.72, collarRef.current.position.y);
    if (shellRef.current)
      shellRef.current.position.y = ease(0 - e * 0.22, shellRef.current.position.y);

    // helix: compact & quiet at rest, blooms on explode
    if (helixGroup.current) {
      helixGroup.current.rotation.y = t * 0.35;
      const s = 0.62 + e * 0.48;
      helixGroup.current.scale.setScalar(s);
    }
    if (helixMatA.current)
      helixMatA.current.emissiveIntensity = ease(
        0.14 + e * 2.4 + Math.sin(t * 2.2) * 0.1,
        helixMatA.current.emissiveIntensity
      );

    // clinical HUD rings during exploded view
    const showRings = Math.max(0, e * 2 - 0.35);
    if (ringInner.current) {
      const m = ringInner.current.material as THREE.MeshBasicMaterial;
      m.opacity = Math.min(0.5, showRings * 0.5);
      ringInner.current.rotation.z = t * 0.25;
      const s = 1 + e * 0.06;
      ringInner.current.scale.setScalar(s);
    }
    if (ringOuter.current) {
      const m = ringOuter.current.material as THREE.MeshBasicMaterial;
      m.opacity = Math.min(0.32, showRings * 0.32);
      ringOuter.current.rotation.z = -t * 0.16;
      ringOuter.current.scale.setScalar(1 + e * 0.1);
    }

    // the white shell turns translucent while exploded → helix reveals
    if (shellMat.current) {
      shellMat.current.opacity = ease(1 - e * 0.88, shellMat.current.opacity);
    }
    if (ridgeMat.current) {
      ridgeMat.current.opacity = ease(1 - e * 0.88, ridgeMat.current.opacity);
    }
  });

  return (
    <group>
      {/* ═══ clinical HUD measurement rings (explode mode) ═══ */}
      <mesh ref={ringInner} position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.94, 0.006, 8, 128]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ringOuter} position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.005, 8, 128]} />
        <meshBasicMaterial color="#c9ced6" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ═══ satin-white body (the REAL product) + printed label ═══ */}
      <group ref={shellRef}>
        <mesh geometry={glassGeo} renderOrder={1}>
          <meshPhysicalMaterial
            ref={shellMat}
            color="#f6f4ef"
            roughness={0.34}
            metalness={0}
            clearcoat={0.55}
            clearcoatRoughness={0.3}
            sheen={0.35}
            sheenColor="#ffffff"
            envMapIntensity={0.9}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* engraved side ridges — sleek 500ml presentation flanks */}
        {[1, -1].map((s) => (
          <mesh
            key={`ridge${s}`}
            position={[s * 0.505, 0.02, 0]}
            rotation={[0, 0, s > 0 ? Math.PI : 0]}
            renderOrder={1}
          >
            <boxGeometry args={[0.02, 0.66, 0.34]} />
            <meshPhysicalMaterial
              ref={s === 1 ? ridgeMat : undefined}
              color="#f6f4ef"
              roughness={0.4}
              metalness={0}
              transparent
              opacity={1}
            />
          </mesh>
        ))}

        {/* front & back printed label bands */}
        <mesh geometry={labelBand} renderOrder={2}>
          <meshStandardMaterial map={labelTex} roughness={0.52} metalness={0.02} envMapIntensity={0.42} />
        </mesh>
        <mesh geometry={labelBand} rotation-y={Math.PI} renderOrder={2}>
          <meshStandardMaterial map={labelTex} roughness={0.52} metalness={0.02} envMapIntensity={0.42} />
        </mesh>
      </group>

      {/* ═══ nutragenetic helix core (revealed on explode) ═══ */}
      <group ref={helixGroup} scale={0.001}>
        <mesh geometry={helix.strandA}>
          <meshStandardMaterial
            ref={helixMatA}
            color="#b97a4b"
            metalness={0.55}
            roughness={0.3}
            emissive="#c98a5a"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh geometry={helix.strandB}>
          <meshStandardMaterial
            color="#dfe4ec"
            metalness={0.7}
            roughness={0.25}
            emissive="#c9ced6"
            emissiveIntensity={0.3}
          />
        </mesh>
        {helix.rungs.map((r, i) => (
          <mesh key={`rung${i}`} position={r.pos} quaternion={r.quat}>
            <cylinderGeometry args={[0.012, 0.012, r.len, 6]} />
            <meshStandardMaterial color="#e3b08a" metalness={0.6} roughness={0.35} emissive="#c98a5a" emissiveIntensity={0.22} />
          </mesh>
        ))}
      </group>

      {/* ═══ silver micro-perforated seal collar ═══ */}
      <group ref={collarRef} position={[0, 1.185, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.235, 0.032, 24, 72]} />
          <meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.18} envMapIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.238, 0.232, 0.055, 72]} />
          <meshStandardMaterial color="#dde1e7" metalness={1} roughness={0.24} envMapIntensity={1.3} />
        </mesh>
      </group>

      {/* ═══ brushed chrome cap (like the real bottle) ═══ */}
      <group ref={capRef} position={[0, 1.41, 0]}>
        <mesh>
          <cylinderGeometry args={[0.262, 0.256, 0.37, 84]} />
          <meshStandardMaterial color="#d9dcdf" metalness={1} roughness={0.22} envMapIntensity={1.5} />
        </mesh>
        {/* top disc */}
        <mesh position={[0, 0.187, 0]}>
          <cylinderGeometry args={[0.262, 0.262, 0.012, 84]} />
          <meshStandardMaterial color="#e8ebee" metalness={1} roughness={0.14} envMapIntensity={1.7} />
        </mesh>
        {/* engraving groove near top */}
        <mesh position={[0, 0.115, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.264, 0.0075, 12, 84]} />
          <meshStandardMaterial color="#9aa0a6" metalness={1} roughness={0.4} />
        </mesh>
        {/* disc-top slot line */}
        <mesh position={[0, 0.194, 0]}>
          <boxGeometry args={[0.3, 0.006, 0.05]} />
          <meshStandardMaterial color="#8f959b" metalness={1} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
