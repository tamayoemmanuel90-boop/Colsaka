"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  adaptPoseToViewport,
  samplePose,
  scrollBus,
  type StagePose,
} from "@/lib/scroll-engine";
import { frameState } from "./frame-state";
import { Bottle } from "./Bottle";
import { MolecularField } from "./MolecularField";
import { HotspotNodes } from "./HotspotNodes";
import { useStageStore } from "@/store/stage";

/**
 * Scroll-choreographed rig: owns every transform applied to the bottle
 * assembly. Targets are sampled from scroll-engine, then critically-damped
 * (exp smoothing) for buttery motion. Idle float + pointer parallax layered
 * on top.
 */
export function BottleRig({
  hotspotId,
  onHotspotSelect,
}: {
  hotspotId: string | null;
  onHotspotSelect: (id: string | null) => void;
}) {
  const root = useRef<THREE.Group>(null);
  const current = useRef<StagePose>({ ...STAGE_POSES_HERO() });
  const tmp = useRef<StagePose>({ ...STAGE_POSES_HERO() });
  const smx = useRef(0);
  const smy = useRef(0);
  const lastStage = useRef<string>("");

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;

    // 1) sample raw target from engine & adapt to viewport
    const stage = samplePose(scrollBus.p, tmp.current);
    adaptPoseToViewport(tmp.current, window.innerWidth);

    // publish to parts (explode driver etc.)
    Object.assign(frameState.pose, tmp.current);

    // stage → zustand (only when changed; tiny re-render of Html markers)
    if (stage !== lastStage.current) {
      lastStage.current = stage;
      useStageStore.getState().setActive(stage);
    }

    // 2) critically-damped approach
    const k = 1 - Math.exp(-delta * 4.4);
    const c = current.current;
    for (const key of ["x", "y", "z", "rx", "ry", "explode", "scale"] as const) {
      c[key] += (tmp.current[key] - c[key]) * k;
    }

    // 3) parallax smoothing
    smx.current += (scrollBus.mx - smx.current) * k * 0.9;
    smy.current += (scrollBus.my - smy.current) * k * 0.9;

    // 4) compose transforms
    const bobY = Math.sin(t * 0.85) * 0.05 * (1 - c.explode * 0.5);
    const bobX = Math.cos(t * 0.62) * 0.02;

    root.current.position.set(c.x + bobX, c.y + bobY, c.z);
    root.current.rotation.set(
      c.rx - smy.current * 0.075,
      c.ry + t * 0.14 + smx.current * 0.16,
      smx.current * 0.03
    );
    root.current.scale.setScalar(c.scale);
  });

  return (
    <group ref={root}>
      <Bottle />
      <HotspotNodes activeId={hotspotId} onSelect={onHotspotSelect} />
      <MolecularField />
    </group>
  );
}

function STAGE_POSES_HERO(): StagePose {
  return { x: 0, y: -1.68, z: -0.72, rx: 0.06, ry: 0.12, explode: 0, scale: 0.9 };
}
