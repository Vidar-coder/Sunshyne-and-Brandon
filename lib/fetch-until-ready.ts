export function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  )
}

function sleep(ms: number, signal?: AbortSignal) {
  if (ms <= 0) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"))
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    }

    signal?.addEventListener("abort", onAbort, { once: true })
  })
}

export async function fetchUntilReady<T>({
  load,
  isReady,
  signal,
  initialDelayMs = 200,
  maxDelayMs = 2000,
  onRetry,
}: {
  load: (signal: AbortSignal) => Promise<T>
  isReady: (value: T) => boolean
  signal?: AbortSignal
  initialDelayMs?: number
  maxDelayMs?: number
  onRetry?: (attempt: number) => void
}): Promise<T> {
  let delay = initialDelayMs
  let attempt = 0

  while (true) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError")
    }

    try {
      const value = await load(signal ?? new AbortController().signal)
      if (isReady(value)) return value
    } catch (error) {
      if (isAbortError(error)) throw error
    }

    attempt += 1
    onRetry?.(attempt)
    await sleep(delay, signal)
    delay = Math.min(Math.round(delay * 1.35), maxDelayMs)
  }
}

export async function readApiList<T>(
  response: Response,
): Promise<T[]> {
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok || !Array.isArray(data)) {
    throw new Error("API list is not ready")
  }
  return data as T[]
}
