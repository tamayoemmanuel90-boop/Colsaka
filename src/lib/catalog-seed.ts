import type { Product } from '@prisma/client'
import { db } from '@/lib/db'

/**
 * Cosalka · Nutragen — canonical clinical catalog seed.
 *
 * Single source of truth for the four SKUs presented on the landing page.
 * Every product ships exclusively in the clinical 500 ml format; the catalog
 * intentionally exposes no other presentation.
 */

/** The one and only clinical presentation sold by Cosalka Nutragen. */
export const CLINICAL_VOLUME_ML = 500 as const

export interface CatalogSeedProduct {
  /** URL-safe unique identifier, e.g. "nutragen-purity". */
  readonly slug: string
  readonly name: string
  readonly tagline: string
  readonly description: string
  /** Unit price in EUR. */
  readonly price: number
  /** Laboratory purity, e.g. "99.97%". */
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
    slug: 'nutragen-purity',
    name: 'Nutragen Purity',
    tagline: 'Hidratación celular de grado clínico',
    description:
      'La base nutragenética esencial de Cosalka. Una formulación mineral de ultrapureza que restablece el equilibrio hídrico celular y optimiza la señalización metabólica en el interior de la célula.',
    price: 129,
    purity: '99.97%',
    accent: '#D4AF37',
    image: '/images/products/purity.png',
    badge: 'Bestseller',
    benefits: [
      'Hidratación intracelular profunda',
      '99.97% pureza verificada por HPLC',
      'Equilibrio electrolítico clínico',
      'Sin conservantes ni aptógenos',
    ],
    sortOrder: 1,
  },
  {
    slug: 'nutragen-vital',
    name: 'Nutragen Vital',
    tagline: 'Energía mitocondrial nutragenética',
    description:
      'Complejo de cofactores bioactivos diseñado para potenciar la producción de ATP mitocondrial y la resistencia al estrés oxidativo, con nanopartículas liposomales de biodisponibilidad validada.',
    price: 139,
    purity: '99.94%',
    accent: '#C9CED6',
    image: '/images/products/vital.png',
    badge: null,
    benefits: [
      'Soporte ATP mitocondrial',
      'Biodisponibilidad 3.4x mejorada',
      'Protección antioxidante clínica',
      'Vegano y sin gluten',
    ],
    sortOrder: 2,
  },
  {
    slug: 'nutragen-derma',
    name: 'Nutragen Derma',
    tagline: 'Regeneración dérmica avanzada',
    description:
      'Biofactor dérmico de nueva generación que actúa sobre la matriz extracelular: estimula la síntesis de colágeno tipo I y III y acelera los ciclos naturales de renovación epidérmica.',
    price: 149,
    purity: '99.95%',
    accent: '#E5CEA6',
    image: '/images/products/derma.png',
    badge: 'Nuevo',
    benefits: [
      'Síntesis de colágeno I y III',
      'Renovación epidérmica acelerada',
      'Firmeza y densidad dérmica',
      'Testado dermatológicamente',
    ],
    sortOrder: 3,
  },
  {
    slug: 'nutragen-nocturne',
    name: 'Nutragen Nocturne',
    tagline: 'Reparación nocturna de precisión',
    description:
      'Protocolo nocturno sincronizado con el cronobioma celular. Libera secuencialmente péptidos de reparación durante las fases profundas del sueño para una recuperación sistémica completa.',
    price: 159,
    purity: '99.98%',
    accent: '#8FA0B5',
    image: '/images/products/nocturne.png',
    badge: null,
    benefits: [
      'Sincronización cronobiológica',
      'Reparación celular nocturna',
      'Liberación secuencial de péptidos',
      'Descanso de calidad clínica',
    ],
    sortOrder: 4,
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
  for (const seed of CATALOG_SEED) {
    const data = {
      name: seed.name,
      tagline: seed.tagline,
      description: seed.description,
      price: seed.price,
      currency: 'EUR',
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
