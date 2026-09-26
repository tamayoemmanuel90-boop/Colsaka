/**
 * Official brand marks for the DEMO payment gateway.
 * Pure inline SVG — no external assets, brand-accurate geometry.
 */

/** Google "G" — official four-color mark. */
export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

/** "Pay" wordmark — neutral, used beside the Google G. */
export function PayWord({
  size = 16,
  color = "#5f6368",
  weight = 500,
}: {
  size?: number;
  color?: string;
  weight?: number;
}) {
  return (
    <span
      style={{ fontSize: size, color, fontWeight: weight, letterSpacing: "-0.01em" }}
      className="font-[system-ui]"
    >
      Pay
    </span>
  );
}

/** Full Google Pay lockup: multicolor G + "Pay". */
export function GooglePayMark({ size = 18, color = "#5f6368" }: { size?: number; color?: string }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label="Google Pay">
      <GoogleG size={size} />
      <PayWord size={size * 0.95} color={color} />
    </span>
  );
}

/** Apple mark (monochrome). */
export function AppleMark({ size = 15, color = "#000000" }: { size?: number; color?: string }) {
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 384 512" aria-hidden>
      <path
        fill={color}
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );
}

/** Full Apple Pay lockup: Apple + "Pay". */
export function ApplePayMark({ size = 16, color = "#000000" }: { size?: number; color?: string }) {
  return (
    <span
      className="inline-flex items-baseline gap-[2px]"
      aria-label="Apple Pay"
      style={{ fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif" }}
    >
      <AppleMark size={size * 1.05} color={color} />
      <span
        style={{ fontSize: size * 1.12, color, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}
      >
        Pay
      </span>
    </span>
  );
}

/** Face ID glyph — used by the Apple Pay demo confirmation. */
export function FaceIdGlyph({ size = 34, color = "#1d1d1f" }: { size?: number; color?: string }) {
  const s = { strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <g stroke={color} {...s}>
        <path d="M3 8V6a3 3 0 0 1 3-3h2M16 3h2a3 3 0 0 1 3 3v2M21 16v2a3 3 0 0 1-3 3h-2M8 21H6a3 3 0 0 1-3-3v-2" />
        <path d="M8.5 9.5v1M15.5 9.5v1M12 9.5v3.2a.8.8 0 0 1-.8.8" />
        <path d="M8.8 15.4c.9.9 2 1.35 3.2 1.35s2.3-.45 3.2-1.35" />
      </g>
    </svg>
  );
}

/** Visa wordmark. */
export function VisaMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.32} viewBox="0 0 48 16" aria-hidden>
      <text
        x="0"
        y="13"
        fontFamily="system-ui, sans-serif"
        fontSize="15"
        fontStyle="italic"
        fontWeight="800"
        fill="#1a1f71"
        letterSpacing="-0.5"
      >
        VISA
      </text>
    </svg>
  );
}

/** Mastercard — two overlapping circles. */
export function MastercardMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 32 20" aria-hidden>
      <circle cx="12" cy="10" r="8.5" fill="#eb001b" />
      <circle cx="20" cy="10" r="8.5" fill="#f79e1b" fillOpacity="0.92" />
      <path d="M16 3.6a8.5 8.5 0 0 1 0 12.8 8.5 8.5 0 0 1 0-12.8z" fill="#ff5f00" />
    </svg>
  );
}

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

/** Loose BIN detection for the demo card form. */
export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

export function BrandMark({ brand, size = 30 }: { brand: CardBrand; size?: number }) {
  if (brand === "visa") return <VisaMark size={size} />;
  if (brand === "mastercard") return <MastercardMark size={size * 0.9} />;
  if (brand === "amex")
    return (
      <span
        className="grid place-items-center rounded-[3px] bg-[#2e77bc] font-bold text-white"
        style={{ width: size * 0.9, height: size * 0.58, fontSize: size * 0.22, letterSpacing: "0.02em" }}
      >
        AMEX
      </span>
    );
  return (
    <span
      className="grid place-items-center rounded-[3px] border border-black/15 bg-black/[0.04] font-mono text-black/40"
      style={{ width: size * 0.9, height: size * 0.58, fontSize: size * 0.3 }}
    >
      ••
    </span>
  );
}
