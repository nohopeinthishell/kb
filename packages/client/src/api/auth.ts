const API_BASE_URL = 'https://ya-praktikum.tech/api/v2'

export type SignInRequest = {
  login: string
  password: string
}

export type SignUpRequest = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type User = {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
  avatar: string | null
}

type ApiErrorBody = {
  reason?: string
}

export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function request<TResponse>(
  path: string,
  init?: RequestInit,
  cookie?: string
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body &&
      !(typeof FormData !== 'undefined' && init.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new ApiError(
      body.reason ?? 'Не удалось выполнить запрос',
      response.status
    )
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

export function getCurrentUser(cookie?: string) {
  return request<User>('/auth/user', undefined, cookie)
}

export async function signIn(data: SignInRequest) {
  return request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function signUp(data: SignUpRequest) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function logout() {
  return request('/auth/logout', { method: 'POST' })
}
