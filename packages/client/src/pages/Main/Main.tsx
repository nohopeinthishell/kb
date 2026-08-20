import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'

export const MainPage = () => (
  <Page>
    <Helmet>
      <title>Таверна</title>
    </Helmet>

    <Title>Таверна</Title>
    <Description>Здесь будет игра.</Description>
  </Page>
)

export const initMainPage = async () => Promise.resolve()

const Page = styled.main`
  margin: 0 auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 48px;
`

const Description = styled.p`
  margin: 0;
  font-size: 18px;
`
