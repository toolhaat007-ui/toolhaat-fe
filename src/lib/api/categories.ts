import { apiFetch, api } from './client'

export interface ApiCategory {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  children?: ApiCategory[]
  productCount?: number
}

export async function getCategoriesServer(): Promise<ApiCategory[]> {
  try {
    return await apiFetch<ApiCategory[]>('/categories', {
      next: { revalidate: 86400, tags: ['categories'] },
    })
  } catch {
    return []
  }
}

export async function getCategoryBySlugServer(slug: string): Promise<ApiCategory | null> {
  try {
    return await apiFetch<ApiCategory>(`/categories/${slug}`, {
      next: { revalidate: 86400, tags: [`category-${slug}`] },
    })
  } catch {
    return null
  }
}

/** The bulk /categories list doesn't nest subcategories — fetch each
 *  top-level category's detail (which does include `children`) so nav
 *  menus can show a full category → subcategory tree. */
export async function getCategoryTreeServer(): Promise<ApiCategory[]> {
  const top = await getCategoriesServer()
  const withChildren = await Promise.all(
    top.map(async c => {
      const detail = await getCategoryBySlugServer(c.slug)
      return { ...c, children: detail?.children ?? [] }
    }),
  )
  return withChildren
}
