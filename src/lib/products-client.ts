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
    id: "fb-purity",
    slug: "nutragen-purity",
    name: "Nutragen Purity",
    tagline: "Hidratación celular de grado clínico",
    description:
      "La base nutragenética esencial de Cosalka. Una formulación mineral de ultrapureza que restablece el equilibrio hídrico celular y optimiza la señalización metabólica.",
    price: 129,
    currency: "EUR",
    volumeMl: 500,
    purity: "99.97%",
    accent: "#D4AF37",
    image: "/images/products/purity.png",
    badge: "Bestseller",
    benefits: [
      "Hidratación intracelular profunda",
      "99.97% pureza verificada por HPLC",
      "Equilibrio electrolítico clínico",
      "Sin conservantes ni aptógenos",
    ],
  },
  {
    id: "fb-vital",
    slug: "nutragen-vital",
    name: "Nutragen Vital",
    tagline: "Energía mitocondrial nutragenética",
    description:
      "Complejo de cofactores bioactivos diseñado para potenciar la producción de ATP mitocondrial y la resistencia al estrés oxidativo.",
    price: 139,
    currency: "EUR",
    volumeMl: 500,
    purity: "99.94%",
    accent: "#C9CED6",
    image: "/images/products/vital.png",
    badge: null,
    benefits: [
      "Soporte ATP mitocondrial",
      "Biodisponibilidad 3.4x mejorada",
      "Protección antioxidante clínica",
      "Vegano y sin gluten",
    ],
  },
  {
    id: "fb-derma",
    slug: "nutragen-derma",
    name: "Nutragen Derma",
    tagline: "Regeneración dérmica avanzada",
    description:
      "Biofactor dérmico de nueva generación que actúa sobre la matriz extracelular y estimula la síntesis de colágeno tipo I y III.",
    price: 149,
    currency: "EUR",
    volumeMl: 500,
    purity: "99.95%",
    accent: "#E5CEA6",
    image: "/images/products/derma.png",
    badge: "Nuevo",
    benefits: [
      "Síntesis de colágeno I y III",
      "Renovación epidérmica acelerada",
      "Firmeza y densidad dérmica",
      "Testado dermatológicamente",
    ],
  },
  {
    id: "fb-nocturne",
    slug: "nutragen-nocturne",
    name: "Nutragen Nocturne",
    tagline: "Reparación nocturna de precisión",
    description:
      "Protocolo nocturno sincronizado con el cronobioma celular, con liberación secuencial de péptidos durante las fases profundas del sueño.",
    price: 159,
    currency: "EUR",
    volumeMl: 500,
    purity: "99.98%",
    accent: "#8FA0B5",
    image: "/images/products/nocturne.png",
    badge: null,
    benefits: [
      "Sincronización cronobiológica",
      "Reparación celular nocturna",
      "Liberación secuencial de péptidos",
      "Descanso de calidad clínica",
    ],
  },
];

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
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
