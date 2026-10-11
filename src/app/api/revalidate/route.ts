import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

/**
 * On-demand ISR revalidation webhook.
 *
 * Called by the NestJS backend after any product/category/brand is
 * created, updated, or deleted. Immediately invalidates the relevant
 * Next.js cache tags so the storefront reflects the changes within
 * seconds instead of waiting up to 1 hour for ISR to expire.
 *
 * POST /api/revalidate
 * Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 * Body: { "tags": ["products", "product-heavy-duty-spade"], "paths": ["/p/agricultural-tools/heavy-duty-spade"] }
 */
export async function POST(req: NextRequest) {
  // Verify secret to prevent unauthorized cache busting
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid revalidation secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const tags: string[] = body.tags ?? []
    const paths: string[] = body.paths ?? []

    // Revalidate by cache tags (fine-grained)
    // Cast: Next 15.5 types require a second "profile" arg not needed at runtime
    for (const tag of tags) {
      ;(revalidateTag as any)(tag)
    }

    // Revalidate specific paths (forces immediate re-render)
    for (const path of paths) {
      revalidatePath(path)
    }

    // Always revalidate sitemap when products/categories change
    if (tags.some(t => ['products', 'categories', 'brands', 'sitemap-products', 'sitemap-categories', 'sitemap-brands'].includes(t))) {
      revalidatePath('/sitemap.xml')
    }

    return Response.json({
      revalidated: true,
      tags,
      paths,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return Response.json({ error: 'Revalidation failed', details: String(err) }, { status: 500 })
  }
}

// Health check
export async function GET() {
  return Response.json({ status: 'ok', endpoint: '/api/revalidate' })
}
