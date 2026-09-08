"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

/**
 * GlowTitle — premium letter-by-letter reveal.
 * Splits each piece into words (kept unbreakable) and chars; every
 * char fades in from a blurred, lifted state with a tight stagger.
 *
 * Crispness guarantee (user request: gold text must not look blurry):
 * the reveal animates a blur filter, but any retained filter — even
 * blur(0px) — keeps each char pinned to a grayscale-antialiased
 * composited layer, so the settled glyphs render soft. As soon as a
 * char finishes animating we strip its inline filter and will-change,
 * returning it to normal crisp text rendering.
 */

export interface TitlePiece {
  t: string;
  /** extra classes for this fragment, e.g. "gold-text glow-gold" */
  c?: string;
}

interface GlowTitleProps {
  lines: Array<Array<TitlePiece>>;
  as?: "h1" | "h2" | "p";
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  /** "mount" animates on load · "inview" animates when scrolled into view */
  mode?: "mount" | "inview";
}

const CHAR_HIDDEN = {
  opacity: 0,
  y: "0.62em",
  filter: "blur(12px)",
};

const CHAR_SHOW = {
  opacity: 1,
  y: "0em",
  filter: "blur(0px)",
};

export function GlowTitle({
  lines,
  as: Tag = "h2",
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.026,
  mode = "inview",
}: GlowTitleProps) {
  const label = lines
    .map((line) => line.map((p) => p.t).join(""))
    .join(" ");

  const animationProps =
    mode === "mount"
      ? {
          initial: "hidden" as const,
          animate: "show" as const,
        }
      : {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, margin: "-70px" },
        };

  let charIndex = 0;
  const charEls = useRef(new Map<number, HTMLElement>());

  /** Settle a char: drop filter + will-change so it renders razor-sharp. */
  const settleChar = (d: number) => () => {
    const el = charEls.current.get(d);
    if (el) {
      el.style.filter = "";
      el.style.willChange = "auto";
    }
  };

  return (
    <Tag className={className} aria-label={label} role="text">
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            {...animationProps}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: stagger,
                  delayChildren: delay + li * 0.14,
                },
              },
            }}
            aria-hidden
            className="block"
          >
            {line.map((piece, pi) =>
              piece.t.split(/(\s+)/).map((token, ti) => {
                if (token.trim() === "") {
                  // word spacer — inline-block collapses real spaces
                  return (
                    <span
                      key={`${pi}-${ti}-sp`}
                      className="inline-block w-[0.24em]"
                    />
                  );
                }
                return (
                  <span
                    key={`${pi}-${ti}-w`}
                    className="inline-block whitespace-nowrap"
                  >
                    {Array.from(token).map((ch) => {
                      const d = charIndex++;
                      return (
                        <motion.span
                          key={`${pi}-${ti}-${d}`}
                          ref={(el) => {
                            if (el) charEls.current.set(d, el);
                            else charEls.current.delete(d);
                          }}
                          onAnimationComplete={settleChar(d)}
                          variants={{
                            hidden: CHAR_HIDDEN,
                            show: CHAR_SHOW,
                          }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className={`inline-block ${charClassName} ${piece.c ?? ""}`}
                        >
                          {ch}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
