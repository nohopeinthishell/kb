import type { PageInitArgs } from '../../routes'

import { FormEvent, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'
import FormLink from '../../ui/FormLink'
import FormUI, { FormError } from '../../ui/FormUI'

import { ROUTES } from '../../constants/routes'
import { initAuth } from '../../modules/auth'
import {
  clearUserError,
  register,
  selectAuthLoading,
  selectUserError,
} from '../../slices/userSlice'
import { useDispatch, useSelector } from '../../store'

export const SignUpPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectUserError)

  useEffect(() => {
    dispatch(clearUserError())
  }, [dispatch])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    try {
      await dispatch(
        register({
          first_name: String(data.get('first_name') ?? ''),
          second_name: String(data.get('second_name') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? ''),
          login: String(data.get('login') ?? ''),
          password: String(data.get('password') ?? ''),
        })
      ).unwrap()

      navigate(ROUTES.main, { replace: true })
    } catch (error: unknown) {
      // Ошибка отобразится на Redux слое
      console.error(error)
    }
  }

  return (
    <Page>
      <Helmet>
        <title>Регистрация | Таверна</title>
      </Helmet>

      <FormUI
        title="Открыть таверну"
        description="Создайте аккаунт и начните принимать первых гостей"
        onSubmit={handleSubmit}>
        <Fields>
          <FormField
            label="Имя"
            name="first_name"
            type="text"
            placeholder="Введите имя"
            autoComplete="given-name"
          />
          <FormField
            label="Фамилия"
            name="second_name"
            type="text"
            placeholder="Введите фамилию"
            autoComplete="family-name"
          />
          <FormField
            label="Почта"
            name="email"
            type="email"
            placeholder="name@example.ru"
            autoComplete="email"
          />
          <FormField
            label="Телефон"
            name="phone"
            type="tel"
            placeholder="+7 999 123-45-67"
            autoComplete="tel"
          />
          <FormField
            label="Логин"
            name="login"
            type="text"
            placeholder="Придумайте логин"
            autoComplete="username"
          />
          <FormField
            label="Пароль"
            name="password"
            type="password"
            placeholder="Придумайте пароль"
            autoComplete="new-password"
          />
        </Fields>
        {error && <FormError role="alert">{error}</FormError>}
        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? 'Регистрация…' : 'Зарегистрироваться'}
        </FormButton>
        <Footer>
          <FooterText>Уже есть аккаунт?</FooterText>
          <FormLink to={ROUTES.signIn}>Войти</FormLink>
        </Footer>
      </FormUI>
    </Page>
  )
}

export const initSignUpPage = async (args: PageInitArgs) => initAuth(args)

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
