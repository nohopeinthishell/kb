import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ApiError, signInWithYandex } from '../../../api'
import { getOAuthRedirectUri, ROUTES } from '../../../constants/routes'
import FormLink from '../../../ui/FormLink'
import { consumeOAuthState } from '../oauthState'

export const OAuthCallbackRoute = ({ children }: PropsWithChildren) => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const code = params.get('code')
  const state = params.getAll('state').length === 1 ? params.get('state') : null
  const oauthError = params.get('error')
  const errorDescription = params.get('error_description')

  if (!code && !oauthError) return <>{children}</>

  return (
    <OAuthCallback
      code={code}
      state={state}
      oauthError={oauthError}
      errorDescription={errorDescription}
    />
  )
}

const OAuthCallback = ({
  code,
  state,
  oauthError,
  errorDescription,
}: {
  code: string | null
  state: string | null
  oauthError: string | null
  errorDescription: string | null
}) => {
  const [error, setError] = useState<string | null>(null)
  const activeCallbackKey = useRef<string | null>(null)

  useEffect(() => {
    const callbackKey = code
      ? `code:${code}`
      : JSON.stringify([oauthError, state, errorDescription])

    if (activeCallbackKey.current === callbackKey) return
    activeCallbackKey.current = callbackKey
    setError(null)

    if (!consumeOAuthState(state)) {
      setError(
        'Не удалось подтвердить запрос на вход. Начните вход через Яндекс заново.'
      )
      return
    }

    if (oauthError) {
      setError(getOAuthErrorMessage(oauthError, errorDescription))
      return
    }

    if (!code) {
      setError('Яндекс не вернул код авторизации. Попробуйте войти ещё раз.')
      return
    }

    const redirectUri = getOAuthRedirectUri(window.location.origin)

    void signInWithYandex({ code, redirect_uri: redirectUri })
      .then(() => {
        if (activeCallbackKey.current === callbackKey) {
          window.location.replace(ROUTES.main)
        }
      })
      .catch((requestError: unknown) => {
        if (activeCallbackKey.current !== callbackKey) return

        setError(
          requestError instanceof ApiError
            ? requestError.message
            : 'Не удалось войти через Яндекс'
        )
      })
  }, [code, errorDescription, oauthError, state])

  return (
    <Page>
      <Helmet>
        <title>Вход через Яндекс | Таверна</title>
      </Helmet>
      <Card aria-live="polite">
        <Title>{error ? 'Не удалось войти' : 'Входим через Яндекс…'}</Title>
        <Description>
          {error ?? 'Подождите, пока мы завершаем авторизацию.'}
        </Description>
        {error && <FormLink to={ROUTES.signIn}>Попробовать снова</FormLink>}
      </Card>
    </Page>
  )
}

const getOAuthErrorMessage = (
  error: string,
  description: string | null
): string => {
  if (error === 'access_denied') {
    return 'Вы отменили вход через Яндекс. Попробуйте ещё раз.'
  }

  return description
    ? `Не удалось войти через Яндекс: ${description}`
    : 'Яндекс не смог завершить авторизацию. Попробуйте ещё раз.'
}

const Page = styled.main`
  min-height: 100%;
  padding: 48px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background.page};
`

const Card = styled.section`
  width: min(100%, 440px);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 20px;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 28px;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`
