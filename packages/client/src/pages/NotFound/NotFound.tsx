import type { PageInitArgs } from '../../routes'

import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import notFoundDoor from './img/not-found-404.png'

import LinkUI from '../../ui/LinkUI'
import { initAuth } from '../../modules/auth'

export const NotFoundPage = () => {
  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>

      <Content>
        <DoorImg src={notFoundDoor} alt="Ошибка 404" />
        <Title>Эта дверь ведёт в никуда</Title>
        <Description>
          Похоже, такой страницы в нашей таверне нет.
          <br />
          Вернитесь в зал — там вас уже ждут.
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

const DoorImg = styled.img`
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

export const initNotFoundPage = async (args: PageInitArgs) => initAuth(args)
