import { RequestHandler } from 'express'

import { COURSE_API_URL } from './courseApiProxy'
import { filterCourseApiCookies } from './filterCourseApiCookies'
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

export function authenticate(
  fetchUser: typeof fetch = fetch,
  apiUrl = COURSE_API_URL
): RequestHandler {
  return createSessionHandler(fetchUser, apiUrl, false)
}

export function getAuthenticatedUser(
  fetchUser: typeof fetch = fetch,
  apiUrl = COURSE_API_URL
): RequestHandler {
  return createSessionHandler(fetchUser, apiUrl, true)
}

function createSessionHandler(
  fetchUser: typeof fetch,
  apiUrl: string,
  returnUser: boolean
): RequestHandler {
  return async (req, res, next) => {
    const isResponseOpen = () =>
      !res.destroyed && !res.writableEnded && !req.aborted
    if (!isResponseOpen()) return
    res.setHeader('Cache-Control', 'no-store')
    const cookie = filterCourseApiCookies(req.headers.cookie)
    if (!cookie) {
      res.status(401).json({ reason: 'Authentication required' })
      return
    }

    const controller = new AbortController()
    const abortOnClose = () => controller.abort()
    res.once('close', abortOnClose)
    const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS)
    try {
      const response = await fetchUser(
        `${apiUrl.replace(/\/$/, '')}/auth/user`,
        {
          headers: { Cookie: cookie },
          signal: controller.signal,
          redirect: 'error',
        }
      )

      if (!isResponseOpen()) return
      if (response.status === 401 || response.status === 403) {
        res.status(403).json({ reason: 'Authentication required' })
        return
      }
      if (!response.ok) {
        res.status(503).json({ reason: 'Authentication service unavailable' })
        return
      }

      const user: unknown = await response.json()
      if (!isResponseOpen()) return
      if (!isAuthenticatedUser(user)) {
        res.status(503).json({ reason: 'Authentication service unavailable' })
        return
      }

      res.locals.user = { id: user.id, login: user.login }
      if (returnUser) {
        // Keep the full course API payload for profile data and SSR hydration.
        res.json(user)
        return
      }
    } catch {
      if (isResponseOpen()) {
        res.status(503).json({ reason: 'Authentication service unavailable' })
      }
      return
    } finally {
      clearTimeout(timeout)
      res.off('close', abortOnClose)
    }
    if (isResponseOpen()) next()
  }
}
