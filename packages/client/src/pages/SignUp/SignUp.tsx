import { FormEvent } from 'react'
import styled from 'styled-components'

import { Helmet } from 'react-helmet-async'
import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'
import FormLink from '../../ui/FormLink'
import FormUI from '../../ui/FormUI'

export const SignUpPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        <FormButton type="submit">Зарегистрироваться</FormButton>
        <Footer>
          <FooterText>Уже есть аккаунт?</FooterText>
          <FormLink to="/sign-in">Войти</FormLink>
        </Footer>
      </FormUI>
    </Page>
  )
}

export const initSignUpPage = async () => Promise.resolve()

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
