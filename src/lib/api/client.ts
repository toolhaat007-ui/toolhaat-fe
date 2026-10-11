// ─── Base API Client ─────────────────────────────────────────────────────────
// Used by server components (fetch with Next.js cache tags)
// and client components (with JWT from localStorage)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Unwrap NestJS TransformInterceptor envelope: { statusCode, data, ... } → data */
function unwrap<T>(json: any): T {
  // Use `in` check so null data returns null, not the wrapper object
  if (json !== null && typeof json === 'object' && 'data' in json) {
    return json.data as T
  }
  return json as T
}

// ─── Server-side fetch (server components / generateStaticParams) ─────────────
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message || 'API error', body)
  }

  const json = await res.json()
  return unwrap<T>(json)
}

// ─── Client-side fetch (with auth token from localStorage) ────────────────────
export async function apiCall<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let token: string | null = null

  // Only access localStorage in browser
  if (typeof window !== 'undefined') {
    try {
      const auth = localStorage.getItem('toolhaat-auth')
      token = auth ? JSON.parse(auth)?.state?.accessToken : null
    } catch {}
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message || 'Request failed', body)
  }

  const json = await res.json()
  return unwrap<T>(json)
}

// ─── Convenience helpers ──────────────────────────────────────────────────────
export const api = {
  get:    <T>(path: string, init?: RequestInit) => apiCall<T>(path, { ...init, method: 'GET' }),
  post:   <T>(path: string, body: any, init?: RequestInit) =>
    apiCall<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: any, init?: RequestInit) =>
    apiCall<T>(path, { ...init, method: 'PUT', body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: any, init?: RequestInit) =>
    apiCall<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => apiCall<T>(path, { ...init, method: 'DELETE' }),
}
