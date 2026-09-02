import type { PageInitArgs } from '../../routes'

import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'
import FormLink from '../../ui/FormLink'
import FormUI, { FormError } from '../../ui/FormUI'

import { ROUTES } from '../../constants/routes'
import { initAuth } from '../../modules/auth'
import {
  login,
  selectAuthLoading,
  selectUserError,
} from '../../slices/userSlice'

import { useDispatch, useSelector } from '../../store'

export const SignInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectUserError)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    try {
      await dispatch(
        login({
          login: String(data.get('login') ?? ''),
          password: String(data.get('password') ?? ''),
        })
      ).unwrap()

      navigate(ROUTES.main, { replace: true })
    } catch (error: unknown) {
      // Ошибка отобразится в Redux слое
      console.error(error)
    }
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
          {isLoading ? 'Входим…' : 'Войти'}
        </FormButton>
        <Footer>
          <FooterText>Ещё нет аккаунта?</FooterText>
          <FormLink to={ROUTES.signUp}>Зарегистрироваться</FormLink>
        </Footer>
      </FormUI>
    </Page>
  )
}

export const initSignInPage = async (args: PageInitArgs) => initAuth(args)

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
