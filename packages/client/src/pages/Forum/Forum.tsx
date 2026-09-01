import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'

export const ForumPage = () => (
  <Page>
    <Helmet>
      <title>Форум</title>
    </Helmet>

    <h1>Форум</h1>
  </Page>
)

const Page = styled.main`
  width: min(100%, 720px);
  margin: 0 auto;
  padding: clamp(24px, 5vw, 64px);
`

export const initForumPage = async () => Promise.resolve()
