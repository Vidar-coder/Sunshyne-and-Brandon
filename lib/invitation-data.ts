const CLIENT_TTL_MS = 30_000

const jsonCache = new Map<string, { data: unknown[]; at: number }>()
const inflight = new Map<string, Promise<unknown[]>>()

export const INVITATION_DATA_URLS = [
  "/api/guests",
  "/api/entourage",
  "/api/principal-sponsor",
] as const

export function prefetchInvitationData() {
  for (const url of INVITATION_DATA_URLS) {
    void fetchInvitationList(url)
  }
  void import("@/components/sections/guest-list")
}

export function invalidateInvitationData(url?: string) {
  if (url) {
    jsonCache.delete(url)
    inflight.delete(url)
    return
  }
  jsonCache.clear()
  inflight.clear()
}

export async function fetchInvitationList<T>(
  url: string,
  options?: { signal?: AbortSignal; reload?: boolean },
): Promise<T[]> {
  if (options?.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }

  if (!options?.reload) {
    const cached = jsonCache.get(url)
    if (cached && Date.now() - cached.at < CLIENT_TTL_MS && cached.data.length > 0) {
      return cached.data as T[]
    }

    const pending = inflight.get(url)
    if (pending) {
      const data = await pending
      if (options?.signal?.aborted) {
        throw new DOMException("Aborted", "AbortError")
      }
      return data as T[]
    }
  }

  const request = (async () => {
    const response = await fetch(url, {
      cache: options?.reload ? "no-store" : "default",
    })
    const data: unknown = await response.json().catch(() => null)
    if (!response.ok || !Array.isArray(data)) {
      throw new Error("API list is not ready")
    }
    if (data.length > 0) {
      jsonCache.set(url, { data, at: Date.now() })
    }
    return data
  })()

  inflight.set(url, request)
  try {
    const data = await request
    if (options?.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError")
    }
    return data as T[]
  } finally {
    if (inflight.get(url) === request) {
      inflight.delete(url)
    }
  }
}
