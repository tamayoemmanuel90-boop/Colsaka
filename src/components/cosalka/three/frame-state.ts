import { STAGE_POSES, type StagePose } from "@/lib/scroll-engine";

/**
 * Module-level mutable snapshot written by BottleRig each frame and read
 * by bottle sub-parts (explode driver, hotspot pulse, etc.).
 * One-frame lag between writer/parts is imperceptible here.
 */
export const frameState: { pose: StagePose } = {
  pose: { ...STAGE_POSES.hero },
};
