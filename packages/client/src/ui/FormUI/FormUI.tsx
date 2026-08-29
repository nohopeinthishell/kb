import { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'

type FormUIProps = {
  title: string
  description: string
  children: ReactNode
  onSubmit?: FormEventHandler<HTMLFormElement>
}

const FormUI = ({ title, description, children, onSubmit }: FormUIProps) => (
  <Form onSubmit={onSubmit} noValidate>
    <Header>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Header>
    {children}
  </Form>
)

const Form = styled.form`
  width: 440px;

  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 20px;
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;

  text-align: center;
`

const Title = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 32px;
  font-weight: 600;
`

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
`

export const FormError = styled.div`
  margin: 0;
  padding: 12px 16px;

  background: ${({ theme }) => theme.colors.feedback.dangerMuted};
  border-radius: 10px;

  color: ${({ theme }) => theme.colors.feedback.danger};
  font-size: 14px;
`

export default FormUI
