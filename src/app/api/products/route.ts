import { NextResponse } from 'next/server'
import { ensureSeeded, toProductDTO } from '@/lib/catalog-seed'
import type { ProductDTO } from '@/lib/catalog-seed'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

type ProductsResponse = { products: ProductDTO[] }
type ErrorResponse = { error: string }

/**
 * GET /api/products
 * Returns the full clinical catalog ordered by `sortOrder` ascending.
 * The catalog is seeded idempotently on first access.
 */
export async function GET(): Promise<NextResponse<ProductsResponse | ErrorResponse>> {
  try {
    await ensureSeeded()

    const rows = await db.product.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    const products: ProductDTO[] = rows.map(toProductDTO)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('[api/products] Failed to load catalog:', error)
    return NextResponse.json(
      { error: 'No se pudo cargar el catálogo' },
      { status: 500 },
    )
  }
}
