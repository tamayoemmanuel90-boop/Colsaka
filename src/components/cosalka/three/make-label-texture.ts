"use client";

import * as THREE from "three";

/**
 * Draws the REAL Nutragen label onto an offscreen canvas and returns a
 * THREE texture. Fully procedural → zero network requests (sandbox-safe).
 * Replica of the client's physical product: COSALKA copper sphere emblem,
 * gold "PASO" pill, bold black NUTRAGEN wordmark, skin-diagram thumbnails,
 * "Ayuda a eliminar escamas y reducir rojeces", red ANTI-PICOR hex badge
 * and the CONT. NETO 500 ML line.
 */
export function makeLabelTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // clean white bottle-face base (the label is printed on the bottle)
    ctx.fillStyle = "#fdfdfb";
    ctx.fillRect(0, 0, W, H);

    const center = (
      text: string,
      y: number,
      font: string,
      fill: string,
      spacing = 0
    ) => {
      ctx.font = font;
      ctx.fillStyle = fill;
      try {
        ctx.letterSpacing = `${spacing}px`;
      } catch {
        /* older engines: draw unspaced */
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, W / 2 + spacing / 2, y);
      try {
        ctx.letterSpacing = "0px";
      } catch {
        /* noop */
      }
    };

    /* ── COSALKA copper sphere emblem ─────────────────────────────── */
    const cx = W / 2;
    const cy = 92;
    const r = 58;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    // globe base
    const globe = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    globe.addColorStop(0, "#d99e6a");
    globe.addColorStop(1, "#b06a3c");
    ctx.fillStyle = globe;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    // wavy latitude stripes (the brand's signature)
    ctx.fillStyle = "#fdf8f3";
    const stripes = [
      { yy: -34, h: 9 },
      { yy: -16, h: 12 },
      { yy: 4, h: 15 },
      { yy: 26, h: 12 },
      { yy: 44, h: 8 },
    ];
    for (const s of stripes) {
      ctx.beginPath();
      ctx.moveTo(cx - r, cy + s.yy);
      ctx.bezierCurveTo(cx - r * 0.3, cy + s.yy - 7, cx + r * 0.3, cy + s.yy + 7, cx + r, cy + s.yy);
      ctx.lineTo(cx + r, cy + s.yy + s.h);
      ctx.bezierCurveTo(cx + r * 0.3, cy + s.yy + s.h + 7, cx - r * 0.3, cy + s.yy + s.h - 7, cx - r, cy + s.yy + s.h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    // soft copper rim
    ctx.strokeStyle = "rgba(160,100,55,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    center("COSALKA", 196, "600 66px 'Helvetica Neue', Arial", "#b97a4b", 18);

    /* ── gold PASO pill ───────────────────────────────────────────── */
    const pillW = 168;
    const pillY = 246;
    ctx.fillStyle = "#f0b429";
    const pw = pillW / 2;
    ctx.beginPath();
    ctx.roundRect(cx - pw, pillY - 22, pillW, 44, 22);
    ctx.fill();
    center("PASO 2", pillY + 1, "700 27px 'Helvetica Neue', Arial", "#ffffff", 4);

    /* ── NUTRAGEN wordmark ────────────────────────────────────────── */
    center("NUTRAGEN", 340, "800 108px 'Helvetica Neue', Arial", "#111112", 3);
    center(
      "PSORIASIS MOISTURIZER",
      412,
      "500 44px 'Helvetica Neue', Arial",
      "#3c3c40",
      9
    );

    /* ── three skin-diagram thumbnails ────────────────────────────── */
    const sqW = 96;
    const sqH = 74;
    const gap = 30;
    const total = sqW * 3 + gap * 2;
    const x0 = cx - total / 2;
    const sqY = 452;
    for (let i = 0; i < 3; i++) {
      const x = x0 + i * (sqW + gap);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, sqY, sqW, sqH, 6);
      ctx.clip();
      const skin = ctx.createLinearGradient(x, sqY, x, sqY + sqH);
      skin.addColorStop(0, "#f2cdb8");
      skin.addColorStop(0.55, "#eec3ad");
      skin.addColorStop(1, "#e59d86");
      ctx.fillStyle = skin;
      ctx.fillRect(x, sqY, sqW, sqH);
      // flaky texture dots on the first two, calmer on the last
      ctx.fillStyle = "rgba(196,110,88,0.55)";
      const dots = i === 2 ? 6 : 16;
      for (let d = 0; d < dots; d++) {
        const dx = x + ((d * 37 + i * 13) % (sqW - 10)) + 5;
        const dy = sqY + ((d * 23 + i * 29) % (sqH - 14)) + 7;
        ctx.beginPath();
        ctx.arc(dx, dy, i === 2 ? 2 : 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(185,122,75,0.8)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, sqY, sqW, sqH, 6);
      ctx.stroke();
    }

    /* ── claim line ───────────────────────────────────────────────── */
    center(
      "Ayuda a eliminar",
      580,
      "600 46px 'Helvetica Neue', Arial",
      "#1a1a1c",
      1
    );
    center(
      "escamas y reducir rojeces",
      628,
      "600 46px 'Helvetica Neue', Arial",
      "#1a1a1c",
      1
    );

    /* ── ANTI-PICOR hex badge ─────────────────────────────────────── */
    const hexX = cx - 96;
    const hexY = 686;
    const hexR = 26;
    // two ghost hexes behind
    ctx.fillStyle = "rgba(212,58,47,0.16)";
    for (const [gx, gy, gr] of [
      [hexX - 40, hexY + 8, hexR * 0.72],
      [hexX - 18, hexY - 20, hexR * 0.5],
    ] as const) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k - Math.PI / 6;
        const px = gx + Math.cos(a) * gr;
        const py = gy + Math.sin(a) * gr;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    // main red hex
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k - Math.PI / 6;
      const px = hexX + Math.cos(a) * hexR;
      const py = hexY + Math.sin(a) * hexR;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "#d43a2f";
    ctx.fill();
    center("ANTI", hexY + 1, "800 20px 'Helvetica Neue', Arial", "#ffffff", 1);
    ctx.font = "800 34px 'Helvetica Neue', Arial";
    ctx.fillStyle = "#d43a2f";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("PICOR", hexX + 36, hexY + 1);

    /* ── net content ──────────────────────────────────────────────── */
    center(
      "CONT. NETO 500 ML",
      H - 26,
      "500 30px 'Helvetica Neue', Arial",
      "#26262a",
      3
    );
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
