import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import LinkUI from '../../ui/LinkUI'
import { ROUTES } from '../../constants/routes'

export const MainPage = () => (
  <Page>
    <Helmet>
      <title>Таверна</title>
    </Helmet>

    <Content>
      <Header>
        <Title>Таверна</Title>
        <Description>
          Ты держишь придорожную таверну шесть недель. Каждую неделю приходит
          новое происшествие — реши, что с ним делать, и потрать золото на
          ремонт столов, помощников и провизию. Задача: дожить до конца шестой
          недели, не разорившись, и набрать как можно больше очков. Одна партия
          — 5–7 минут.
        </Description>
      </Header>
      <Content>
        <Nav>
          <MenuList>
            <li>
              <LinkUI to={ROUTES.game} $variant="primary">
                Играть
              </LinkUI>
            </li>
            <li>
              <LinkUI to={ROUTES.forum} $variant="secondary">
                Форум
              </LinkUI>
            </li>
            <li>
              <LinkUI to={ROUTES.leaderboard} $variant="secondary">
                Лидерборд
              </LinkUI>
            </li>
            <li>
              <LinkUI to={ROUTES.profile} $variant="secondary">
                Профиль
              </LinkUI>
            </li>
          </MenuList>
        </Nav>
      </Content>
    </Content>
  </Page>
)

const Page = styled.main`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: clamp(24px, 5vw, 64px);
`

const Content = styled.div`
  width: min(100%, 560px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
`

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 48px;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.6;
`

const Nav = styled.nav``

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  li {
    display: grid;
  }
`

export const initMainPage = async () => Promise.resolve()
