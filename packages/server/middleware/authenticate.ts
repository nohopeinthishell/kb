import { RequestHandler } from 'express'

const AUTH_USER_URL = 'https://ya-praktikum.tech/api/v2/auth/user'
const AUTH_TIMEOUT_MS = 5000

export type AuthenticatedUser = {
  id: number
  login: string
}

export type AuthenticatedLocals = {
  user: AuthenticatedUser
}

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (typeof value !== 'object' || value === null) return false
  const user = value as Record<string, unknown>
  return (
    typeof user.id === 'number' &&
    Number.isSafeInteger(user.id) &&
    user.id > 0 &&
    typeof user.login === 'string' &&
    user.login.length > 0
  )
}

export function authenticate(fetchUser: typeof fetch = fetch): RequestHandler {
  return async (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    const cookie = req.headers.cookie
    if (!cookie?.trim()) {
      res.status(401).json({ reason: 'Authentication required' })
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS)
    try {
      const response = await fetchUser(AUTH_USER_URL, {
        headers: { Cookie: cookie },
        signal: controller.signal,
        redirect: 'error',
      })

      if (response.status === 401 || response.status === 403) {
        res.status(401).json({ reason: 'Authentication required' })
        return
      }
      if (!response.ok) {
        res.status(503).json({ reason: 'Authentication service unavailable' })
        return
      }

      const user: unknown = await response.json()
      if (!isAuthenticatedUser(user)) {
        res.status(503).json({ reason: 'Authentication service unavailable' })
        return
      }

      res.locals.user = { id: user.id, login: user.login }
      next()
    } catch {
      res.status(503).json({ reason: 'Authentication service unavailable' })
    } finally {
      clearTimeout(timeout)
    }
  }
}
