import styled from 'styled-components'

import FormButton from '../../../ui/FormButton'

type AuthCheckFailureProps = {
  onRetry: () => void
}

export const AuthCheckFailure = ({ onRetry }: AuthCheckFailureProps) => (
  <Container role="alert">
    <Title>Не удалось проверить авторизацию</Title>
    <Description>
      Проверьте подключение к интернету и попробуйте ещё раз.
    </Description>
    <FormButton type="button" onClick={onRetry}>
      Повторить
    </FormButton>
  </Container>
)

const Container = styled.section`
  min-height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.page};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 28px;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`
