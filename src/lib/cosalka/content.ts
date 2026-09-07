import type { StageName } from "@/lib/scroll-engine";

/* ── Navigation ─────────────────────────────────────────────────────── */
export const NAV_LINKS: Array<{ label: string; target: string }> = [
  { label: "Inicio", target: "inicio" },
  { label: "Sobre nosotros", target: "origen" },
  { label: "Tienda", target: "tienda" },
  { label: "FAQ", target: "faq" },
  { label: "Contacto", target: "contacto" },
];

/* ── Hero hook (mirror of nutragen.mx's opening question) ───────────── */
export const HERO = {
  kicker: "Ciencia · Innovación · Resultados",
  sub: "parches temporales, no — barrera y fortaleza. nutragenética de vanguardia.",
};

/* ── 01 · La verdad — no es un apagafuegos químico ──────────────────── */
export const VERDAD = {
  kicker: "01 — La verdad incómoda",
  line: "Nutrición pura para tu estrato córneo — no un apagafuegos químico.",
  chips: ["Sin esteroides", "Sin cortisona", "Sin efecto rebote"],
};

/* ── 02 · Doble acción — paso 1 + paso 2 ────────────────────────────── */
export const RUTINA = {
  kicker: "02 — Doble acción",
  steps: [
    {
      n: "Paso 1",
      title: "Suaviza y renueva",
      body: "Reduce la apariencia de escamas y rojeces con humectación profunda.",
    },
    {
      n: "Paso 2",
      title: "Calma y protege",
      body: "Alivia la comezón y la tirantez. Confort inmediato, absorción en un minuto.",
    },
  ],
  meta: "Paso 1 + Paso 2 · 500 ml · garantía de 30 días",
};

/* ── 3D Hotspots (anchored to the bottle in the actúa stage) ────────── */
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
    title: "Barrera del estrato córneo",
    body: "La capa más externa de la epidermis: allí actúa la fórmula.",
    stat: "Capa 1",
    statLabel: "Diana clínica",
    position: [0.0, 1.32, 0],
    side: "right",
  },
  {
    id: "nanoparticulas",
    title: "Nanopartículas activas",
    body: "Matriz liposomal de ~120 nm que cruza los espacios intercelulares.",
    stat: "3.4×",
    statLabel: "Absorción medida",
    position: [-0.68, -0.1, 0.3],
    side: "right",
  },
  {
    id: "pureza",
    title: "Agua clínica estructurada",
    body: "Hidratación sin fragancia ni corticoides. Vegana y sin retoques.",
    stat: "99.97%",
    statLabel: "Pureza HPLC",
    position: [0.52, -0.95, 0.26],
    side: "left",
  },
];

/* ── 04 · Origen — la historia (padre e hijo) ───────────────────────── */
export const ORIGEN = {
  kicker: "04 — Origen",
  line: "Padre e hijo. Doce años de investigación botánica. Hoy: la fórmula Nutragen de Cosalka.",
  timeline: [
    { year: "Día 0", label: "Un diagnóstico decía “un par de meses”." },
    { year: "12 años", label: "Investigación en plantas medicinales." },
    { year: "Hoy", label: "Nutragen — Cosalka. Piel que vuelve a sentirse piel." },
  ],
};

/* ── 05 · Qué es / qué no es ────────────────────────────────────────── */
export const ESNO = {
  kicker: "05 — Honestidad clínica",
  es: [
    "Cosmético tópico de uso diario",
    "Ingredientes de origen natural, vegano",
    "Textura ligera de absorción rápida",
    "Sin fragancia añadida ni colorantes",
    "Para toda la familia",
  ],
  noEs: [
    "No es un medicamento",
    "No sustituye a tu dermatólogo",
    "Sin corticoides ni esteroides",
    "Sin promesas de milagros",
    "Sin dependencia ni efecto rebote",
  ],
};

/* ── 06 · Cuatro hábitos ────────────────────────────────────────────── */
export const HABITOS = [
  {
    id: "agua",
    title: "Agua constante",
    body: "La hidratación desde dentro reduce tirantez y descamación.",
  },
  {
    id: "sol",
    title: "Sol con protector",
    body: "Incluso nublado: la quemadura dispara el brote.",
  },
  {
    id: "roce",
    title: "Sin frotar",
    body: "El roce reactiva la placa. Palmaditas al secar, siempre.",
  },
  {
    id: "constancia",
    title: "Dos veces al día",
    body: "Si te lavas los dientes, puedes con esto. Constancia lo es todo.",
  },
];

/* ── 07 · Voces — testimonios reales ────────────────────────────────── */
export const VOCES = {
  kicker: "07 — Personas reales",
  quote: "No pidas milagros. Queremos que lo compruebes tú mismo.",
  items: [
    {
      text: "Tenía cuello y pecho en carne viva. Ya puedo usar escote otra vez sin pensar en quién me está viendo.",
      name: "Guadalupe R.",
      ctx: "Psoriasis en cuello y pecho",
      when: "Día 48",
    },
    {
      text: "En cuatro días la placa de la nuca bajó casi por completo. No lo creía hasta que comparé mis propias fotos.",
      name: "María E.",
      ctx: "Cuero cabelludo",
      when: "Semana 2",
    },
    {
      text: "Semana 2 y al fin usé shorts. Ya no me da pena salir.",
      name: "José Manuel",
      ctx: "Psoriasis en piernas",
      when: "Semana 3",
    },
  ],
  legal: "Experiencias individuales. Los resultados varían según cada piel.",
};

/* ── 09 · Envíos ────────────────────────────────────────────────────── */
export const ENVIOS = {
  kicker: "09 — Envíos",
  stats: [
    { value: "24/72 h", label: "Entrega península" },
    { value: "150 €", label: "Envío gratis desde" },
    { value: "GPS", label: "Seguimiento en tiempo real" },
  ],
  regiones: "España · Europa · México · Latinoamérica",
};

/* ── 10 · Garantía ──────────────────────────────────────────────────── */
export const GARANTIA = {
  kicker: "10 — Garantía",
  line: "Si sigues el protocolo y no ves resultados, te devolvemos el 100%. Sin letras chiquitas.",
  email: "clinica@cosalka.com",
};

/* ── Science section cards (cómo actúa · exploded view) ─────────────── */
export const SCIENCE_STATS = [
  { value: "99.97%", label: "Pureza HPLC" },
  { value: "3.4×", label: "Absorción" },
  { value: "ISO 7", label: "Sala limpia" },
];

/* ── FAQ — las dudas que más nos escriben ───────────────────────────── */
export const FAQ_ITEMS = [
  {
    q: "¿Qué aporta usar Nutragen en casa?",
    a: "Integra humectación y cuidado en tu horario con una rutina de dos pasos. Complementa tu día a día entre consultas; el dermatólogo sigue siendo quien evalúa tu piel.",
  },
  {
    q: "¿Contiene corticoides o esteroides?",
    a: "No. Cero corticoides, cero esteroides, cero cortisona. Es una fórmula cosmética vegana, no un fármaco.",
  },
  {
    q: "¿Lo puedo usar en niños?",
    a: "Sí. Al ser una fórmula vegana y sin fragancia es apta para toda la familia; en menores y pieles lesionadas consulta antes con un profesional.",
  },
  {
    q: "¿Por qué el formato de 500 ml?",
    a: "Es nuestra unidad clínica integral: un ciclo completo sellado en atmósfera inerte para estabilidad total.",
  },
  {
    q: "¿Cuánto tarda en llegar?",
    a: "24–72 h en península con seguimiento incluido. Europa y LATAM en 3–7 días laborables.",
  },
  {
    q: "¿Y si no veo resultados?",
    a: "Tienes 30 días de garantía de devolución del 100% siguiendo el protocolo. Sin discutir y sin letras chiquitas.",
  },
];

/* ── Cierre ─────────────────────────────────────────────────────────── */
export const CIERRE = {
  line: "bienestar, atención y confianza — empieza hoy tu protocolo.",
  cta: "Empezar mi protocolo",
};

/* ── Flagship reference for hero CTA ────────────────────────────────── */
export const FLAGSHIP_SLUG = "nutragen-purity";

export type { StageName };
