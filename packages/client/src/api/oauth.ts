import { request } from './auth'

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize'

type YandexServiceIdResponse = {
  service_id: string
}

type YandexOAuthRequest = {
  code: string
  redirect_uri: string
}

export const getYandexServiceId = (redirectUri: string) =>
  request<YandexServiceIdResponse>(
    `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
  )

export const signInWithYandex = (data: YandexOAuthRequest) =>
  request<void>('/oauth/yandex', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const createYandexAuthorizeUrl = (
  serviceId: string,
  redirectUri: string,
  state: string
) => {
  const url = new URL(YANDEX_AUTHORIZE_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', serviceId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('state', state)

  return url.toString()
}
