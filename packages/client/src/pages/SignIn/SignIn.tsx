import { FormEvent } from 'react'
import styled from 'styled-components'

import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'
import FormLink from '../../ui/FormLink'
import FormUI from '../../ui/FormUI'

export const SignInPage = () => {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <Page>
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
        <FormButton type="submit">Войти</FormButton>
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
