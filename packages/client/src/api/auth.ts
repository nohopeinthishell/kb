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

export async function request<Response>(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.reason ?? 'Не удалось выполнить запрос')
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return undefined as Response
  }

  return response.json() as Promise<Response>
}

export function getCurrentUser() {
  return request<User>('/auth/user')
}

export async function signIn(data: SignInRequest) {
  return request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === 'User already in system') {
      return
    }

    throw error
  })
}

export async function signUp(data: SignUpRequest) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === 'User already in system') {
      return
    }

    throw error
  })
}
