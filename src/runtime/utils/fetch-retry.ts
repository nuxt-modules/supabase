export async function fetchWithRetry(req: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const retries = 3
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(req, init)
    }
    catch (error) {
      // Don't retry if it's an abort
      if (init?.signal?.aborted) {
        throw error
      }
      if (attempt === retries) {
        const { headers: _headers, ...safeInit } = init ?? {}
        console.error(`Error fetching request ${req}`, error, safeInit)
        throw error
      }
      console.warn(`Retrying fetch attempt ${attempt + 1} for request: ${req}`)

      // Small incremental delay before retry
      await new Promise(resolve => setTimeout(resolve, 100 * attempt))
    }
  }
  throw new Error('Unreachable code')
}
