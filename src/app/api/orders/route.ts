import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ensureSeeded, STORE_CURRENCY } from '@/lib/catalog-seed'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/** Hard business limits enforced server-side (mirrored by the storefront cart). */
const MAX_QTY_PER_LINE = 12
const MAX_UNITS_PER_SLUG = 12

const orderItemSchema = z.object({
  slug: z.string().trim().min(1, 'El slug del producto es obligatorio'),
  qty: z
    .number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1')
    .max(MAX_QTY_PER_LINE, `La cantidad máxima es ${MAX_QTY_PER_LINE}`),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'El carrito está vacío'),
})

interface OrderLine {
  slug: string
  name: string
  qty: number
  price: number
  lineTotal: number
}

interface CreateOrderSuccess {
  ok: true
  orderId: string
  total: number
  currency: string
  createdAt: string
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * POST /api/orders — body: { items: [{ slug, qty }] }
 * Validates input with zod, resolves products server-side and computes the
 * total authoritatively on the server before persisting the order.
 */
export async function POST(request: Request): Promise<NextResponse<CreateOrderSuccess | { error: string; details?: string[] }>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Cuerpo de petición inválido (se esperaba JSON)' },
      { status: 400 },
    )
  }

  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => {
      const path = issue.path.map(String).join('.')
      return `${path || 'body'}: ${issue.message}`
    })
    return NextResponse.json({ error: 'Petición inválida', details }, { status: 400 })
  }

  // Merge duplicated slugs so quantities are aggregated per product.
  const qtyBySlug = new Map<string, number>()
  for (const item of parsed.data.items) {
    qtyBySlug.set(item.slug, (qtyBySlug.get(item.slug) ?? 0) + item.qty)
  }

  for (const [slug, qty] of qtyBySlug) {
    if (qty > MAX_UNITS_PER_SLUG) {
      return NextResponse.json(
        { error: `Cantidad máxima superada para ${slug} (${qty}/${MAX_UNITS_PER_SLUG})` },
        { status: 400 },
      )
    }
  }

  try {
    await ensureSeeded()

    const slugs = [...qtyBySlug.keys()]
    const products = await db.product.findMany({
      where: { slug: { in: slugs } },
    })
    const bySlug = new Map(products.map((product) => [product.slug, product]))

    const lines: OrderLine[] = []
    for (const slug of slugs) {
      const product = bySlug.get(slug)
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${slug}` },
          { status: 400 },
        )
      }
      const qty = qtyBySlug.get(slug) ?? 1
      lines.push({
        slug,
        name: product.name,
        qty,
        price: product.price,
        lineTotal: round2(product.price * qty),
      })
    }

    const total = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0))

    const order = await db.order.create({
      data: {
        total,
        currency: STORE_CURRENCY,
        items: JSON.stringify(lines),
        status: 'confirmed',
      },
    })

    return NextResponse.json(
      {
        ok: true,
        orderId: order.id,
        total: order.total,
        currency: order.currency,
        createdAt: order.createdAt.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[api/orders] Failed to create order:', error)
    return NextResponse.json(
      { error: 'No se pudo procesar el pedido' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/orders — lightweight counter used for social proof.
 * Non-critical: never fails the client, falls back to 0.
 */
export async function GET(): Promise<NextResponse<{ orderCount: number }>> {
  try {
    const orderCount = await db.order.count()
    return NextResponse.json({ orderCount })
  } catch (error) {
    console.error('[api/orders] Failed to count orders:', error)
    return NextResponse.json({ orderCount: 0 })
  }
}
