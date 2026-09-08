import type { StageName } from "@/lib/scroll-engine";

/* ────────────────────────────────────────────────────────────────────────
   Cosalka · Nutragen — REAL client content.
   Sources (client Drive folder "Nutragen logo y productos"):
   · COLSALKA NUTRAGEN etiquetas pdf  → claims, 500 ml, anti-picor,
     ingredientes (Neem, Cola de Caballo, Ortiga, Verbena, Hialurónico),
     "Hecho en México", "No probado en animales", Cosalka International.
   · ebook_psoriasis_nutragen_final.pdf → ciencia real (IL-17, TNF-α,
     NF-kB, intestino permeable, Candida, sal marina 84 minerales,
     protocolo maestro 30 días, 4 pilares de hábitos).
   · nutragen.mx (sitio del cliente) → estructura narrativa y promesas
     ("Paquete Doble Acción", "Personas reales. Fechas reales.",
     "Te acompañamos 30 días", "México, Estados Unidos y toda LATAM").
   ──────────────────────────────────────────────────────────────────────── */

/* ── Navigation — every section is a REAL route (Amazon-style) ─────── */
export const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Tienda", href: "/tienda" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
];

/* ── Hero hook (mirror of nutragen.mx's opening question) ───────────── */
export const HERO = {
  kicker: "Tecnología Nutragenética · Hecho en México",
  sub: "parches temporales, no — barrera y fortaleza. nutragenética de vanguardia.",
};

/* ── Preview value strip — the essence, zero prices ─────────────────── */
export const VERDAD = {
  kicker: "01 — Lo esencial",
  line: "Nutrición pura para tu estrato córneo — no un apagafuegos químico.",
  chips: ["Sin esteroides", "Sin cortisona", "Sin efecto rebote"],
};

/* ── 02 · Doble acción — paso 1 + paso 2 (etiquetas reales) ─────────── */
export const RUTINA = {
  kicker: "02 — Doble acción",
  steps: [
    {
      n: "Paso 1",
      title: "Treatment · anti-picor",
      body: "Crema orgánica que ayuda a eliminar escamas y reducir rojeces.",
    },
    {
      n: "Paso 2",
      title: "Moisturizer · calma",
      body: "Hidratación profunda que alivia la comezón y la tirantez.",
    },
  ],
  meta: "Paso 1 + Paso 2 · 500 ml cada uno · garantía de 30 días",
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
    title: "Complejo botánico Neem + Ortiga",
    body: "El Neem purifica y la Ortiga calma la picazón desde la primera aplicación.",
    stat: "Anti-Picor",
    statLabel: "Acción clínica",
    position: [0.0, 1.32, 0],
    side: "right",
  },
  {
    id: "nanoparticulas",
    title: "Cola de Caballo + Ácido hialurónico",
    body: "Silicio orgánico que repara la matriz de colágeno e hidrata en profundidad.",
    stat: "500 ml",
    statLabel: "Formato clínico",
    position: [-0.68, -0.1, 0.3],
    side: "right",
  },
  {
    id: "pureza",
    title: "Fórmula orgánica certificada",
    body: "Sin corticoides ni esteroides. Vegana y no testeada en animales.",
    stat: "100%",
    statLabel: "Origen botánico",
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

/* ── 05 · Qué es / qué no es (claims reales de etiqueta) ────────────── */
export const ESNO = {
  kicker: "05 — Honestidad clínica",
  es: [
    "Cosmético tópico de uso diario",
    "Con Neem, Cola de Caballo, Ortiga y Verbena",
    "Ácido hialurónico + manteca de karité",
    "No probado en animales",
    "Hecho en México por Cosalka International",
  ],
  noEs: [
    "No es un medicamento",
    "No sustituye a tu dermatólogo",
    "Sin corticoides ni esteroides",
    "Sin promesas de milagros",
    "Sin dependencia ni efecto rebote",
  ],
};

/* ── 06 · Cuatro hábitos (protocolo real del ebook "Domina la
        Psoriasis" — capítulos 2, 3 y 4 + protocolo maestro) ─────────── */
export const HABITOS = [
  {
    id: "agua",
    title: "Agua viva con sal marina",
    body: "Una pizca de sal marina virgen: 84 minerales que reactivan la hidratación celular.",
  },
  {
    id: "sol",
    title: "Jugos verdes al extractor",
    body: "Pepino, apio, espinaca y limón: magnesio líquido que apaga el sistema nervioso.",
  },
  {
    id: "roce",
    title: "Sudar y mover la linfa",
    body: "30 minutos de caminata o ejercicio: abrir poros, expulsar ácidos y frenar el cortisol.",
  },
  {
    id: "constancia",
    title: "Eje emocional en calma",
    body: "Lo que la boca calla, la piel lo grita. Respira 4 segundos, exhala 8. Todos los días.",
  },
];

/* ── 07 · Voces — testimonios reales + media real del cliente ───────── */
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
  /** Real before/after case photos from the client archive. */
  casos: [
    {
      before: "/images/client/antes-cuero.jpg",
      after: "/images/client/despues-cuero.jpg",
      ctx: "Cuero cabelludo",
      when: "Día 21",
    },
    {
      before: "/images/client/antes-brazo.jpg",
      after: "/images/client/despues-brazo.jpg",
      ctx: "Antebrazo",
      when: "Día 30",
    },
  ],
  /** Real unscripted video testimonials from the client archive. */
  videos: [
    { src: "/video/testimonio-1.mp4", ctx: "Testimonio real · sin guion" },
    { src: "/video/testimonio-2.mp4", ctx: "Testimonio real · sin guion" },
  ],
};

/* ── 09 · Envíos (mercados reales: México · USA · LATAM) ────────────── */
export const ENVIOS = {
  kicker: "09 — Envíos",
  stats: [
    { value: "24/72 h", label: "Entrega nacional" },
    { value: "$1,500", label: "Envío gratis desde" },
    { value: "GPS", label: "Seguimiento en tiempo real" },
  ],
  regiones: "México · Estados Unidos · toda Latinoamérica",
};

/* ── 10 · Garantía (nutragen.mx: "Te acompañamos 30 días") ──────────── */
export const GARANTIA = {
  kicker: "10 — Garantía",
  line: "No te vendemos un frasco: te acompañamos 30 días. Si no ves resultados, te devolvemos el 100%.",
  email: "clinica@cosalka.com",
};

/* ── Science section stats (ciencia real del ebook) ─────────────────── */
export const SCIENCE_STATS = [
  { value: "IL-17 · TNF-α", label: "Vía inflamatoria" },
  { value: "84", label: "Minerales de sal marina" },
  { value: "500 ml", label: "Formato clínico" },
];

/* ── FAQ — las dudas que más nos escriben (respuestas reales) ───────── */
export const FAQ_ITEMS = [
  {
    q: "¿Qué aporta usar Nutragen en casa?",
    a: "Integra humectación y cuidado en tu horario con la rutina de dos pasos. Complementa tu día a día entre consultas; el dermatólogo sigue siendo quien evalúa tu piel.",
  },
  {
    q: "¿Contiene corticoides o esteroides?",
    a: "No. Cero corticoides, cero esteroides. Es una crema corporal orgánica con tecnología nutragenética: Neem, Cola de Caballo, Ortiga, Verbena y ácido hialurónico.",
  },
  {
    q: "¿Lo puedo usar en niños?",
    a: "Sí. Al ser una fórmula orgánica sin esteroides es apta para toda la familia; en menores y pieles lesionadas consulta antes con un profesional.",
  },
  {
    q: "¿Por qué el formato de 500 ml?",
    a: "Es nuestra unidad clínica: un ciclo completo del protocolo Doble Acción sellado para estabilidad total. Ningún frasco pequeño alcanza para los 30 días.",
  },
  {
    q: "¿Hacia dónde envían?",
    a: "A todo México en 24–72 h con seguimiento, y también a Estados Unidos y toda Latinoamérica en 3–7 días laborables.",
  },
  {
    q: "¿Y si no veo resultados?",
    a: "No te vendemos un frasco: te acompañamos 30 días. Si sigues el protocolo y no ves resultados, te devolvemos el 100%. Sin letras chiquitas.",
  },
];

/* ── Cierre ─────────────────────────────────────────────────────────── */
export const CIERRE = {
  line: "bienestar, atención y confianza — empieza hoy tu protocolo.",
  cta: "Empezar mi protocolo",
};

/* ── Flagship reference for hero CTA (el offer real de nutragen.mx) ─── */
export const FLAGSHIP_SLUG = "paquete-doble-accion";

export type { StageName };
