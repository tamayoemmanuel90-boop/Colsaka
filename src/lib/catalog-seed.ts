import type { Product } from '@prisma/client'
import { db } from '@/lib/db'

/**
 * Cosalka · Nutragen — canonical clinical catalog seed.
 *
 * Single source of truth for the SKUs presented on the landing page.
 * Product line mirrors the client's REAL catalog (etiquetas PDF + nutragen.mx):
 * Paso 1 Treatment, Paso 2 Moisturizer and the Doble Acción bundle.
 * Every product ships exclusively in the clinical 500 ml format; the catalog
 * intentionally exposes no other presentation.
 */

/** The one and only clinical presentation sold by Cosalka Nutragen. */
export const CLINICAL_VOLUME_ML = 500 as const

/** Storefront currency — Cosalka International is a Mexican brand. */
export const STORE_CURRENCY = 'MXN' as const

export interface CatalogSeedProduct {
  /** URL-safe unique identifier, e.g. "paso-1-treatment". */
  readonly slug: string
  readonly name: string
  readonly tagline: string
  readonly description: string
  /** Unit price in MXN. */
  readonly price: number
  /** Key claim shown in the storefront UI (e.g. "Anti-Picor"). */
  readonly purity: string
  /** Hex accent color consumed by the storefront UI. */
  readonly accent: string
  /** Static asset path served from /public. */
  readonly image: string
  /** Optional merchandising badge ("Bestseller", "Nuevo", ...). */
  readonly badge: string | null
  readonly benefits: readonly string[]
  readonly sortOrder: number
}

/** Public representation of a product returned by GET /api/products. */
export interface ProductDTO {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number
  currency: string
  volumeMl: number
  purity: string
  accent: string
  image: string
  badge: string | null
  benefits: string[]
}

export const CATALOG_SEED: readonly CatalogSeedProduct[] = [
  {
    slug: 'paso-1-treatment',
    name: 'Paso 1 · Psoriasis Treatment',
    tagline: 'Crema corporal orgánica · anti-picor',
    description:
      'Primer paso del protocolo Doble Acción: crema corporal orgánica con tecnología nutragenética que ayuda a eliminar escamas y reducir rojeces, con efecto anti-picor inmediato.',
    price: 899,
    purity: 'Anti-Picor',
    accent: '#D4AF37',
    image: '/images/client/producto-paso1.jpg',
    badge: null,
    benefits: [
      'Ayuda a eliminar escamas y reducir rojeces',
      'Efecto anti-picor inmediato',
      'Con Neem, Cola de Caballo, Ortiga y Verbena',
      'Ácido hialurónico + manteca de karité',
    ],
    sortOrder: 1,
  },
  {
    slug: 'paso-2-moisturizer',
    name: 'Paso 2 · Psoriasis Moisturizer',
    tagline: 'Crema corporal orgánica · hidratación profunda',
    description:
      'Segundo paso del protocolo Doble Acción: hidratación profunda que calma la tirantez, sella la humedad y devuelve elasticidad y confort a la piel descamada.',
    price: 899,
    purity: 'Hidratación',
    accent: '#C9CED6',
    image: '/images/client/producto-paso2.jpg',
    badge: null,
    benefits: [
      'Hidratación profunda de larga duración',
      'Alivia tirantez, comezón e irritación',
      'Con aceite de coco, oliva y karité',
      'Textura ligera de absorción rápida',
    ],
    sortOrder: 2,
  },
  {
    slug: 'paquete-doble-accion',
    name: 'Paquete Doble Acción',
    tagline: 'Paso 1 + Paso 2 · protocolo completo',
    description:
      'El protocolo completo de nutragenética: Paso 1 Treatment (anti-picor) + Paso 2 Moisturizer (hidratación profunda). Dos pasos, una rutina fácil de seguir, 30 días de acompañamiento.',
    price: 1590,
    purity: 'Protocolo',
    accent: '#E5CEA6',
    image: '/images/client/paquete-doble-accion.jpg',
    badge: 'Protocolo completo',
    benefits: [
      'Rutina de dos pasos, fácil de seguir',
      'Paso 1 Treatment + Paso 2 Moisturizer',
      'Acompañamiento personalizado 30 días',
      'Hecho en México · no testeado en animales',
    ],
    sortOrder: 3,
  },
]

function serializeBenefits(benefits: readonly string[]): string {
  return JSON.stringify([...benefits])
}

function parseBenefits(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string')
    }
  } catch {
    // Corrupted row — degrade gracefully instead of breaking the response.
  }
  return []
}

/** Maps a raw Prisma `Product` row (benefits stored as JSON string) to the public DTO. */
export function toProductDTO(product: Product): ProductDTO {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    currency: product.currency,
    volumeMl: product.volumeMl,
    purity: product.purity,
    accent: product.accent,
    image: product.image,
    badge: product.badge,
    benefits: parseBenefits(product.benefits),
  }
}

async function runSeed(): Promise<void> {
  // Purge retired SKUs (e.g. the pre-launch fictional line) so the storefront
  // only ever offers the real Cosalka · Nutragen products.
  const activeSlugs = CATALOG_SEED.map((seed) => seed.slug)
  await db.product.deleteMany({ where: { slug: { notIn: activeSlugs } } })

  for (const seed of CATALOG_SEED) {
    const data = {
      name: seed.name,
      tagline: seed.tagline,
      description: seed.description,
      price: seed.price,
      currency: STORE_CURRENCY,
      volumeMl: CLINICAL_VOLUME_ML,
      purity: seed.purity,
      accent: seed.accent,
      image: seed.image,
      badge: seed.badge,
      benefits: serializeBenefits(seed.benefits),
      sortOrder: seed.sortOrder,
    }

    await db.product.upsert({
      where: { slug: seed.slug },
      update: data,
      create: { ...data, slug: seed.slug },
    })
  }
}

const globalForSeed = globalThis as unknown as {
  __cosalkaNutragenSeedPromise?: Promise<void>
}

/**
 * Idempotently upserts the canonical catalog, memoized as a single promise per
 * process so concurrent requests share one run. A failed attempt clears the
 * memo so the next request can retry (transient DB availability, etc.).
 */
export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__cosalkaNutragenSeedPromise) {
    globalForSeed.__cosalkaNutragenSeedPromise = runSeed().catch((error: unknown) => {
      globalForSeed.__cosalkaNutragenSeedPromise = undefined
      throw error
    })
  }
  return globalForSeed.__cosalkaNutragenSeedPromise
}
