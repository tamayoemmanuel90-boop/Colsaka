"use client";

import * as THREE from "three";

/**
 * Draws the clinical product label onto an offscreen canvas and returns a
 * THREE texture. Fully procedural → zero network requests (sandbox-safe).
 */
export function makeLabelTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // graphite base with vertical falloff
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#111114");
    bg.addColorStop(0.5, "#16161a");
    bg.addColorStop(1, "#101013");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // faint carbon weave
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    for (let y = 8; y < H; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // gold hairline frame
    ctx.strokeStyle = "rgba(212,175,55,0.85)";
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, W - 52, H - 52);
    ctx.strokeStyle = "rgba(212,175,55,0.30)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // corner ticks
    ctx.strokeStyle = "rgba(232,207,143,0.9)";
    ctx.lineWidth = 4;
    const tick = 34;
    const corners: Array<[number, number, number, number]> = [
      [26, 26, 1, 1],
      [W - 26, 26, -1, 1],
      [26, H - 26, 1, -1],
      [W - 26, H - 26, -1, -1],
    ];
    for (const [cx, cy, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx + dx * tick, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy * tick);
      ctx.stroke();
    }

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
        /*@ts-expect-error experimental API*/
        ctx.letterSpacing = `${spacing}px`;
      } catch {
        /* older engines: draw unspaced */
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, W / 2 + spacing / 2, y);
      try {
        /*@ts-expect-error experimental API*/
        ctx.letterSpacing = "0px";
      } catch {
        /* noop */
      }
    };

    center("COSALKA", 172, "600 128px 'Helvetica Neue', Arial", "#f4f4f6", 26);
    center(
      "N U T R A G E N",
      300,
      "500 72px 'Helvetica Neue', Arial",
      "#d4af37",
      8
    );

    // divider with diamond
    const grad = ctx.createLinearGradient(240, 0, W - 240, 0);
    grad.addColorStop(0, "rgba(212,175,55,0)");
    grad.addColorStop(0.5, "rgba(212,175,55,0.9)");
    grad.addColorStop(1, "rgba(212,175,55,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(240, 382);
    ctx.lineTo(W / 2 - 22, 382);
    ctx.moveTo(W / 2 + 22, 382);
    ctx.lineTo(W - 240, 382);
    ctx.stroke();
    ctx.save();
    ctx.translate(W / 2, 382);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();

    center(
      "FÓRMULA CLÍNICA · NUTRAGENÉTICA",
      450,
      "500 34px 'Helvetica Neue', Arial",
      "rgba(244,244,246,0.66)",
      10
    );
    center(
      "500 ml ℮   ·   PUREZA ≥ 99.9%   ·   ISO CLASE 7",
      532,
      "400 30px monospace",
      "rgba(201,206,214,0.55)",
      4
    );

    // molecule mark bottom-right
    ctx.strokeStyle = "rgba(212,175,55,0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W - 96, H - 86, 15, 0, Math.PI * 2);
    ctx.arc(W - 66, H - 106, 9, 0, Math.PI * 2);
    ctx.moveTo(W - 81, H - 93);
    ctx.lineTo(W - 74, H - 99);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
