type CacheEntry<T> = {
  value?: T
  expiresAt: number
  inflight?: Promise<T>
}

const store = new Map<string, CacheEntry<unknown>>()

export const SHEETS_CACHE_KEYS = {
  guests: "guests",
  entourage: "entourage",
  sponsors: "sponsors",
} as const

const DEFAULT_TTL_MS = 25_000

function isUsefulList(value: unknown) {
  return Array.isArray(value) && value.length > 0
}

export async function withSheetsCache<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS,
): Promise<T> {
  const now = Date.now()
  const existing = store.get(key) as CacheEntry<T> | undefined

  if (existing?.value !== undefined && existing.expiresAt > now) {
    return existing.value
  }

  if (existing?.inflight) {
    return existing.inflight
  }

  const inflight = loader()
    .then((value) => {
      if (isUsefulList(value)) {
        store.set(key, { value, expiresAt: Date.now() + ttlMs })
      } else {
        store.delete(key)
      }
      return value
    })
    .catch((error) => {
      const current = store.get(key) as CacheEntry<T> | undefined
      if (current?.inflight === inflight) {
        store.set(key, {
          value: existing?.value,
          expiresAt: existing?.expiresAt ?? 0,
        })
      }
      throw error
    })

  store.set(key, {
    value: existing?.value,
    expiresAt: existing?.expiresAt ?? 0,
    inflight,
  })

  return inflight
}

export function invalidateSheetsCache(key: string) {
  store.delete(key)
}

export async function fetchGoogleScriptJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  })

  if (!response.ok) {
    throw new Error(`Google Script request failed (${response.status})`)
  }

  return response.json()
}

export const listResponseHeaders = {
  "Cache-Control": "public, max-age=20, stale-while-revalidate=60",
} as const
