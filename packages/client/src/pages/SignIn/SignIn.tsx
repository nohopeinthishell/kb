import { FormEvent, useState } from 'react'
import styled from 'styled-components'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { ApiError, signIn } from '../../api'
import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'
import FormLink from '../../ui/FormLink'
import FormUI, { FormError } from '../../ui/FormUI'

export const SignInPage = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    setIsLoading(true)
    setError(null)

    signIn({
      login: String(data.get('login') ?? ''),
      password: String(data.get('password') ?? ''),
    })
      .then(() => navigate('/'))
      .catch((requestError: unknown) =>
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : 'Не удалось связаться с сервером'
        )
      )
      .finally(() => setIsLoading(false))
  }

  return (
    <Page>
      <Helmet>
        <title>Вход | Таверна</title>
      </Helmet>
      <FormUI
        title="Добро пожаловать"
        description="Войдите, чтобы управлять таверной"
        onSubmit={handleSubmit}>
        <Fields>
          <FormField
            label="Логин"
            name="login"
            type="text"
            placeholder="Введите логин"
            autoComplete="username"
          />
          <FormField
            label="Пароль"
            name="password"
            type="password"
            placeholder="Введите пароль"
            autoComplete="current-password"
          />
        </Fields>
        {error && <FormError role="alert">{error}</FormError>}
        <FormButton type="submit" disabled={isLoading}>
          Войти
        </FormButton>
        <Footer>
          <FooterText>Ещё нет аккаунта?</FooterText>
          <FormLink to="/sign-up">Зарегистрироваться</FormLink>
        </Footer>
      </FormUI>
    </Page>
  )
}

export const initSignInPage = async () => Promise.resolve()

const Page = styled.main`
  min-height: 100%;

  padding: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.background.page};
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  gap: 4px;
`

const FooterText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font: inherit;
  font-size: 16px;
`
