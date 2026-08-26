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
    body: "Cápsula metal-mecánica con doble junta de fluoropolímero. Ensamblada en sala limpia ISO Clase 7, nunca expuesta a aire ambiente.",
    stat: "ISO 7",
    statLabel: "Sala limpia certificada",
    position: [0.0, 1.32, 0],
    side: "right",
  },
  {
    id: "nanoparticulas",
    title: "Nanopartículas activas",
    body: "Matriz liposomal de ~120 nm que encapsula los activos nutragenéticos y los protege del pH gástrico hasta su liberación en diana.",
    stat: "3.4×",
    statLabel: "Biodisponibilidad medida",
    position: [-0.68, -0.1, 0.3],
    side: "right",
  },
  {
    id: "pureza",
    title: "Pureza verificada HPLC",
    body: "Cada lote de 500 ml se analiza por cromatografía líquida de alta resolución. Trazabilidad completa vía pasaporte digital de lote.",
    stat: "99.97%",
    statLabel: "Pureza cromatográfica",
    position: [0.52, -0.95, 0.26],
    side: "left",
  },
];

/* ── Science section cards ──────────────────────────────────────────── */
export const SCIENCE_CARDS = [
  {
    id: "eficacia",
    title: "Eficacia Clínica",
    body: "Formulaciones validadas en estudios observacionales independientes sobre biomarcadores celulares reales — no sobre promesas de marketing.",
    stat: "94.2%",
    statLabel: "Mejora media de marcadores hidroelectrolíticos a 30 días",
  },
  {
    id: "laboratorio",
    title: "Estándar de Laboratorio",
    body: "Producción en sala limpia ISO Clase 7 bajo normativas GMP farmacéuticas. Cada unidad de 500 ml conserva su certificado cromatográfico individual.",
    stat: "HPLC",
    statLabel: "Verificación cromatográfica lote a lote",
  },
  {
    id: "tecnologia",
    title: "Tecnología Vanguardista",
    body: "Nanopartículas liposomales programables y sellado en atmósfera inerte: la molécula llega intacta desde nuestro reactor hasta tu célula.",
    stat: "≤120 nm",
    statLabel: "Diámetro medio de la matriz liposomal",
  },
];

/* ── FAQ ────────────────────────────────────────────────────────────── */
export const FAQ_ITEMS = [
  {
    q: "¿Qué es exactamente la nutragenética aplicada por Cosalka?",
    a: "La nutragenética estudia cómo los micronutrientes modulan la expresión y señalización celular. En Cosalka traducimos ese principio en formulaciones minerales y peptídicas de ultrapureza, diseñadas para actuar sobre rutas metabólicas concretas verificadas in vitro e in vivo antes de llegar al formato clínico final.",
  },
  {
    q: "¿Por qué la colección Nutragen se presenta en formato 500 ml?",
    a: "El frasco de 500 ml es nuestra unidad clínica integral: corresponde a un ciclo completo de aplicación sellado de forma estéril en atmósfera inerte. Evitamos formatos parciales para garantizar que cada ciclo conserve la misma estabilidad fisicoquímica desde el primer hasta el último mililitro.",
  },
  {
    q: "¿Cómo debo dosificar el producto durante el ciclo?",
    a: "Cada frasco integra una guía graduada de precisión en su lateral. Recomendamos seguir el protocolo del ciclo completo de 500 ml bajo criterio profesional; la absorción sublingual en pequeñas tomas diarias optimiza la biodisponibilidad de la matriz liposomal.",
  },
  {
    q: "¿Qué certificaciones y estándares de pureza cumplís?",
    a: "Producimos en sala limpia ISO Clase 7 bajo normas GMP. Cada lote se analiza mediante HPLC para descartar metales pesados, aptógenos y residuos de disolventes, con un umbral mínimo de pureza del 99,9%. El certificado acompaña cada compra vía pasaporte digital de lote.",
  },
  {
    q: "¿Cómo son los envíos y embalajes?",
    a: "Enviamos en cajas térmicas selladas con amortiguación clínica. Península: 24–48 h con seguro incluido. Envíos internacionales con seguimiento entre 3–7 días laborables. El precinto de seguridad individual garantiza que tu unidad no ha sido manipulada.",
  },
  {
    q: "¿Puedo devolver el producto si no estoy satisfecho?",
    a: "Sí. Dispones de 30 días naturales desde la entrega siempre que el precinto clínico permanezca intacto. Gestionamos la recogida y el reembolso íntegro sin preguntas — aunque nos encantaría conocer tus observaciones para mejorar la siguiente generación.",
  },
];

/* ── Flagship reference for hero CTA ────────────────────────────────── */
export const FLAGSHIP_SLUG = "nutragen-purity";

export type { StageName };
