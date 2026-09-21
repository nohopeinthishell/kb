import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ApiError, signInWithYandex } from '../../../api'
import { getOAuthRedirectUri, ROUTES } from '../../../constants/routes'
import FormLink from '../../../ui/FormLink'

export const OAuthCallbackRoute = ({ children }: PropsWithChildren) => {
  const { search } = useLocation()
  const code = new URLSearchParams(search).get('code')

  if (!code) return <>{children}</>

  return <OAuthCallback code={code} />
}

const OAuthCallback = ({ code }: { code: string }) => {
  const [error, setError] = useState<string | null>(null)
  const exchangeStarted = useRef(false)

  useEffect(() => {
    if (exchangeStarted.current) return
    exchangeStarted.current = true

    const redirectUri = getOAuthRedirectUri(window.location.origin)

    void signInWithYandex({ code, redirect_uri: redirectUri })
      .then(() => window.location.replace(ROUTES.main))
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : 'Не удалось войти через Яндекс'
        )
      })
  }, [code])

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
        {error && <FormLink to={ROUTES.signIn}>Вернуться ко входу</FormLink>}
      </Card>
    </Page>
  )
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
