"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

/**
 * SmoothScroll — boots Lenis for every store route and snaps to top on
 * client-side navigation (Next.js route change → instant scroll reset).
 */
export function SmoothScroll() {
  const pathname = usePathname();
  useSmoothScroll(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
