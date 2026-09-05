import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

import FormButton from '../../ui/FormButton'

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<PropsWithChildren, State> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Возникла ошибка!', error, errorInfo)
  }

  // Стрелка, а не метод: так `this` привязан к инстансу и не теряется,
  // когда React передаёт функцию в onClick
  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Page>
          <Content>
            <Title>Что-то пошло не так :(</Title>
            <Description>
              В приложении произошла ошибка. Попробуйте перезагрузить страницу.
            </Description>
            <ReloadButton type="button" onClick={this.handleReload}>
              Перезагрузить страницу
            </ReloadButton>
          </Content>
        </Page>
      )
    }
    return this.props.children
  }
}

const Page = styled.section`
  min-height: 100%;
  width: 100%;
  padding: clamp(24px, 5vw, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.page};
`

const Content = styled.div`
  width: min(100%, 920px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
`

const Description = styled.p`
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.6;
`

const ReloadButton = styled(FormButton)`
  margin-top: 32px;

  @media (max-width: 480px) {
    width: 100%;
  }
`

export default ErrorBoundary
