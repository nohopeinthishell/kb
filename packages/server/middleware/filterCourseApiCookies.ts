const SESSION_COOKIE_NAMES = new Set(['authCookie', 'uuid'])

export function filterCourseApiCookies(cookie?: string): string | undefined {
  if (!cookie) return undefined

  const selected: string[] = []
  const seen = new Set<string>()
  for (const part of cookie.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    const name = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (!SESSION_COOKIE_NAMES.has(name) || seen.has(name) || !value) continue
    // Preserve opaque session values, including encoding and embedded '='.
    selected.push(`${name}=${value}`)
    seen.add(name)
  }

  return selected.join('; ') || undefined
}
