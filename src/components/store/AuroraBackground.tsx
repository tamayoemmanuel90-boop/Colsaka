/**
 * AuroraBackground — living background for every NON-3D page.
 * Three blurred gold/silver gradients drifting on long alternate loops
 * plus slow golden motes. Pure CSS (GPU compositor), zero JS, honors
 * prefers-reduced-motion. The home page is the only page WITHOUT this —
 * there the WebGL bottle owns the atmosphere.
 */
const MOTES = [
  { left: "8%", top: "22%", delay: "0s", dur: "13s" },
  { left: "86%", top: "12%", delay: "-4s", dur: "15s" },
  { left: "72%", top: "58%", delay: "-8s", dur: "12s" },
  { left: "22%", top: "72%", delay: "-2s", dur: "16s" },
  { left: "48%", top: "38%", delay: "-6s", dur: "14s" },
  { left: "92%", top: "80%", delay: "-10s", dur: "17s" },
] as const;

export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden>
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
      {MOTES.map((m, i) => (
        <i
          key={i}
          style={{
            left: m.left,
            top: m.top,
            animationDelay: m.delay,
            animationDuration: m.dur,
          }}
        />
      ))}
    </div>
  );
}
