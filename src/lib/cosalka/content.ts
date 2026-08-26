import type { StageName } from "@/lib/scroll-engine";

/* ── Navigation ─────────────────────────────────────────────────────── */
export const NAV_LINKS: Array<{ label: string; target: string }> = [
  { label: "Inicio", target: "inicio" },
  { label: "Sobre nosotros", target: "ciencia" },
  { label: "Tienda", target: "tienda" },
  { label: "FAQ", target: "faq" },
  { label: "Contacto", target: "contacto" },
];

/* ── 3D Hotspots (anchored to the bottle in the spotlight stage) ────── */
export interface HotspotDef {
  id: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
  /** local position relative to the bottle group */
  position: [number, number, number];
  /** which side the info card opens toward (screen space) */
  side: "left" | "right";
}

export const HOTSPOTS: HotspotDef[] = [
  {
    id: "sellado",
    title: "Sellado clínico estéril",
    body: "Doble junta de fluoropolímero, ensamblada en sala limpia.",
    stat: "ISO 7",
    statLabel: "Sala limpia certificada",
    position: [0.0, 1.32, 0],
    side: "right",
  },
  {
    id: "nanoparticulas",
    title: "Nanopartículas activas",
    body: "Matriz liposomal de ~120 nm. Protección hasta la diana celular.",
    stat: "3.4×",
    statLabel: "Biodisponibilidad medida",
    position: [-0.68, -0.1, 0.3],
    side: "right",
  },
  {
    id: "pureza",
    title: "Pureza verificada HPLC",
    body: "Cromatografía lote a lote. Pasaporte digital incluido.",
    stat: "99.97%",
    statLabel: "Pureza cromatográfica",
    position: [0.52, -0.95, 0.26],
    side: "left",
  },
];

/* ── Science section cards (minimal: icon + title + stat) ───────────── */
export const SCIENCE_CARDS = [
  {
    id: "eficacia",
    title: "Eficacia Clínica",
    stat: "94.2%",
    statLabel: "Marcadores hidroelectrolíticos",
  },
  {
    id: "laboratorio",
    title: "Estándar de Laboratorio",
    stat: "ISO 7 · GMP",
    statLabel: "Sala limpia farmacéutica",
  },
  {
    id: "tecnologia",
    title: "Tecnología Vanguardista",
    stat: "≤120 nm",
    statLabel: "Matriz liposomal",
  },
];

/* ── FAQ (minimal clinical) ─────────────────────────────────────────── */
export const FAQ_ITEMS = [
  {
    q: "¿Qué es la nutragenética?",
    a: "Micronutrientes de ultrapureza que modulan rutas celulares concretas. Ciencia verificable, no promesas.",
  },
  {
    q: "¿Por qué el formato de 500 ml?",
    a: "Es nuestra unidad clínica integral: un ciclo completo sellado en atmósfera inerte para estabilidad total.",
  },
  {
    q: "¿Qué pureza garantizáis?",
    a: "HPLC lote a lote con umbral mínimo del 99,9%. El certificado digital acompaña cada compra.",
  },
  {
    q: "¿Cómo son los envíos?",
    a: "24–48 h en Península con seguro incluido. Internacional con seguimiento en 3–7 días laborables.",
  },
];

/* ── Flagship reference for hero CTA ────────────────────────────────── */
export const FLAGSHIP_SLUG = "nutragen-purity";

export type { StageName };
