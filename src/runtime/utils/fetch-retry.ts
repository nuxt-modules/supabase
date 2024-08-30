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
        console.error(`Error fetching request ${req}`, error, init)
        throw error
      }
      console.warn(`Retrying fetch attempt ${attempt + 1} for request: ${req}`)
    }
  }
  throw new Error('Unreachable code')
}
