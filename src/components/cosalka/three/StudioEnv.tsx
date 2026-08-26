"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural clinical studio lighting — no external HDRIs (sandbox-safe).
 * Big soft white boxes above/behind for glass reflections, a warm gold
 * kicker from the left, cool silver rim from the right.
 */
export function StudioEnv() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 7, 5]} intensity={1.05} color="#ffffff" />
      <directionalLight position={[-6, 3, -4]} intensity={0.4} color="#e8cf8f" />
      <pointLight position={[2.4, -1.6, 3]} intensity={0.55} color="#d4af37" distance={9} decay={2} />

      <Environment resolution={256} frames={1}>
        {/* ceiling softbox */}
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -5]} scale={[11, 4, 1]} />
        {/* left warm gold kicker */}
        <Lightformer form="rect" intensity={1.25} color="#f2dfae" rotation-y={Math.PI / 2} position={[-7, 0.6, 2]} scale={[8, 3, 1]} />
        {/* right cool silver fill */}
        <Lightformer form="rect" intensity={1.7} color="#eef2f8" rotation-y={-Math.PI / 2} position={[7, 0.8, 3]} scale={[8, 3, 1]} />
        {/* back rim */}
        <Lightformer form="rect" intensity={1.35} color="#dfe6ee" position={[0, 1.2, -8]} scale={[13, 5, 1]} />
        {/* floor bounce with a whisper of gold */}
        <Lightformer form="circle" intensity={0.55} color="#d4af37" rotation-x={Math.PI / 2} position={[0, -5, 2]} scale={7} />
      </Environment>
    </>
  );
}
