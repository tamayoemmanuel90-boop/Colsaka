import type { ReactNode } from "react";
import { StoreNav } from "@/components/store/StoreNav";
import { StoreFooter } from "@/components/store/StoreFooter";
import { AuroraBackground } from "@/components/store/AuroraBackground";
import { SmoothScroll } from "@/components/store/SmoothScroll";

/**
 * (store) route group — every page EXCEPT the 3D presentation "/".
 * Shared chrome: living aurora background (no WebGL here), sticky glass
 * nav, Lenis smooth scroll and the film grain. "/" keeps its own layout
 * inside src/app/page.tsx.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <AuroraBackground />

      <div className="relative z-10 flex min-h-screen flex-col bg-paper/60 text-ink selection:bg-gold selection:text-graphite">
        <StoreNav />
        <main className="relative flex flex-1 flex-col">{children}</main>
        <StoreFooter />
      </div>

      {/* film grain, same as the landing */}
      <div className="grain pointer-events-none fixed inset-0 z-[75]" aria-hidden />
    </>
  );
}
