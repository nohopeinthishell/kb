import { RequestHandler } from 'express'
import { request as httpRequest } from 'http'
import { request as httpsRequest } from 'https'
import { filterCourseApiCookies } from './filterCourseApiCookies'

export const COURSE_API_URL = 'https://ya-praktikum.tech/api/v2'

export type CourseApiOptions = {
  apiUrl?: string
  secureCookies?: boolean
  timeoutMs?: number
}

// Host-only cookies belong to the backend that returns them, not the course API.
export function rewriteSessionCookie(cookie: string, secure: boolean): string {
  const [value, ...attributes] = cookie.split(';')
  const retained = attributes.filter(
    attribute =>
      !/^(domain|path|samesite|secure|httponly)(?:=|$)/i.test(attribute.trim())
  )
  return [
    value,
    ...retained.map(attribute => attribute.trim()),
    'Path=/',
    'HttpOnly',
    secure ? 'SameSite=None' : 'SameSite=Lax',
    ...(secure ? ['Secure'] : []),
  ].join('; ')
}

export function courseApiProxy(options: CourseApiOptions = {}): RequestHandler {
  const target = new URL(options.apiUrl || COURSE_API_URL)
  const secure =
    options.secureCookies ??
    (process.env.AUTH_COOKIE_SECURE === 'true' ||
      (process.env.AUTH_COOKIE_SECURE !== 'false' &&
        process.env.NODE_ENV === 'production'))
  const send = target.protocol === 'https:' ? httpsRequest : httpRequest

  return (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    const headers: Record<string, string> = {}
    for (const name of ['accept', 'content-type', 'content-length']) {
      const value = req.headers[name]
      if (typeof value === 'string') headers[name] = value
    }
    const cookie = filterCourseApiCookies(req.headers.cookie)
    if (cookie) headers.cookie = cookie
    const upstream = send(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port,
        // Never resolve a user-controlled URL: the upstream host is fixed.
        path: `${target.pathname.replace(/\/$/, '')}${req.url}`,
        method: req.method,
        headers,
      },
      response => {
        res.status(response.statusCode || 502)
        for (const name of ['content-type', 'content-disposition']) {
          const value = response.headers[name]
          if (value) res.setHeader(name, value)
        }
        const cookies = response.headers['set-cookie']
        if (cookies)
          res.setHeader(
            'Set-Cookie',
            cookies.map(cookie => rewriteSessionCookie(cookie, secure))
          )
        response.on('error', () => res.destroy())
        response.pipe(res)
      }
    )
    const timeout = setTimeout(
      () => upstream.destroy(new Error('Proxy timeout')),
      options.timeoutMs ?? 10000
    )
    upstream.on('close', () => clearTimeout(timeout))
    upstream.on('error', () => {
      if (res.headersSent) res.destroy()
      else res.status(502).json({ reason: 'Course API unavailable' })
    })
    req.on('aborted', () => upstream.destroy())
    res.on('close', () => upstream.destroy())
    // Preserve raw JSON and multipart bodies without parsing or re-encoding.
    req.pipe(upstream)
  }
}
