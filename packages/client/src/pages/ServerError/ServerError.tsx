import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import LinkUI from '../../ui/LinkUI'
import serverError from './img/server-error-500.png'

export const ServerError = () => {
  return (
    <Page>
      <Helmet>
        <title>500</title>
        <meta name="description" content="Серверная ошибка" />
      </Helmet>

      <Content>
        <ErrorImg src={serverError} alt="Сломанный механизм — ошибка 500" />
        <Title>В таверне что-то сломалось</Title>
        <Description>
          Сервер не смог обработать запрос.
          <br />
          Мы уже раздуваем угли и чиним механизм.
        </Description>
        <ReturnLink to="/">
          Вернуться в таверну <span aria-hidden="true">→</span>
        </ReturnLink>
      </Content>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100%;
  width: 100%;
  padding: clamp(24px, 5vw, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.page};
`

const Content = styled.section`
  width: min(100%, 920px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const ErrorImg = styled.img`
  width: min(100%, 650px);
  height: auto;
  margin-bottom: clamp(8px, 1.5vw, 20px);
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

const ReturnLink = styled(LinkUI)`
  margin-top: 32px;

  @media (max-width: 480px) {
    width: 100%;
  }
`
