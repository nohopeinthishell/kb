import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import LinkUI from '../../ui/LinkUI'
import { ROUTES } from '../../constants/routes'
// Vite отдаёт из импорта картинки готовый URL, а не сам файл
import tavernBg from './tavern.jpg'

export const MainPage = () => (
  <Page>
    <Backdrop />

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
  position: relative; /* якорь для Backdrop */
  isolation: isolate; /* свой контекст наложения: иначе z-index: -1 уйдёт за фон body */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: clamp(24px, 5vw, 64px);
`

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: ${({ theme }) =>
      theme.name === 'dark'
        ? 'linear-gradient(rgba(18, 17, 15, 0.55), rgba(18, 17, 15, 0.82))'
        : 'radial-gradient(120% 90% at 50% 45%, rgba(244, 241, 234, 0.84), rgba(244, 241, 234, 0.52) 55%, rgba(244, 241, 234, 0.34))'},
    url(${tavernBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
