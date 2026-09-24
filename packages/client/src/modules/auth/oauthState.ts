const STORAGE_KEY = 'yandex-oauth-state'
const MAX_AGE_MS = 10 * 60 * 1000

export const createOAuthState = (): string => {
  const bytes = window.crypto.getRandomValues(new Uint8Array(32))
  const state = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0')
  ).join('')

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ state, createdAt: Date.now() })
  )
  return state
}

export const consumeOAuthState = (state: string | null): boolean => {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    // Consume even a failed attempt so a callback cannot be replayed.
    window.sessionStorage.removeItem(STORAGE_KEY)
    if (!state || !stored) return false

    const pending: unknown = JSON.parse(stored)
    if (
      typeof pending !== 'object' ||
      pending === null ||
      !('state' in pending) ||
      !('createdAt' in pending) ||
      pending.state !== state ||
      typeof pending.createdAt !== 'number'
    ) {
      return false
    }

    const age = Date.now() - pending.createdAt
    return age >= 0 && age < MAX_AGE_MS
  } catch {
    // Unavailable storage or malformed data must never allow a code exchange.
    return false
  }
}
