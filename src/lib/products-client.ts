"use client";

/**
 * Client-safe product contract + resilient fetcher.
 * Mirrors ProductDTO returned by GET /api/products (see src/lib/catalog-seed.ts).
 * Never imports server-only modules.
 */

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  volumeMl: number;
  purity: string;
  accent: string;
  image: string;
  badge?: string | null;
  benefits: string[];
}

export const FALLBACK_PRODUCTS: ProductDTO[] = [
  {
    id: "fb-paso-1",
    slug: "paso-1-treatment",
    name: "Paso 1 · Psoriasis Treatment",
    tagline: "Crema corporal orgánica · anti-picor",
    description:
      "Primer paso del protocolo Doble Acción: crema corporal orgánica con tecnología nutragenética que ayuda a eliminar escamas y reducir rojeces, con efecto anti-picor inmediato.",
    price: 899,
    currency: "MXN",
    volumeMl: 500,
    purity: "Anti-Picor",
    accent: "#D4AF37",
    image: "/images/client/producto-paso1.jpg",
    badge: null,
    benefits: [
      "Ayuda a eliminar escamas y reducir rojeces",
      "Efecto anti-picor inmediato",
      "Con Neem, Cola de Caballo, Ortiga y Verbena",
      "Ácido hialurónico + manteca de karité",
    ],
  },
  {
    id: "fb-paso-2",
    slug: "paso-2-moisturizer",
    name: "Paso 2 · Psoriasis Moisturizer",
    tagline: "Crema corporal orgánica · hidratación profunda",
    description:
      "Segundo paso del protocolo Doble Acción: hidratación profunda que calma la tirantez, sella la humedad y devuelve elasticidad y confort a la piel descamada.",
    price: 899,
    currency: "MXN",
    volumeMl: 500,
    purity: "Hidratación",
    accent: "#C9CED6",
    image: "/images/client/producto-paso2.jpg",
    badge: null,
    benefits: [
      "Hidratación profunda de larga duración",
      "Alivia tirantez, comezón e irritación",
      "Con aceite de coco, oliva y karité",
      "Textura ligera de absorción rápida",
    ],
  },
  {
    id: "fb-doble-accion",
    slug: "paquete-doble-accion",
    name: "Paquete Doble Acción",
    tagline: "Paso 1 + Paso 2 · protocolo completo",
    description:
      "El protocolo completo de nutragenética: Paso 1 Treatment (anti-picor) + Paso 2 Moisturizer (hidratación profunda). Dos pasos, una rutina fácil de seguir, 30 días de acompañamiento.",
    price: 1590,
    currency: "MXN",
    volumeMl: 500,
    purity: "Protocolo",
    accent: "#E5CEA6",
    image: "/images/client/paquete-doble-accion.jpg",
    badge: "Protocolo completo",
    benefits: [
      "Rutina de dos pasos, fácil de seguir",
      "Paso 1 Treatment + Paso 2 Moisturizer",
      "Acompañamiento personalizado 30 días",
      "Hecho en México · no testeado en animales",
    ],
  },
];

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function fetchProducts(): Promise<ProductDTO[]> {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { products?: ProductDTO[] };
    return json.products?.length ? json.products : FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}
