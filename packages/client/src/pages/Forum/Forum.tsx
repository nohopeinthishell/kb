import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import { getTopics, TopicList } from '../../modules/forum'
import LinkUI from '../../ui/LinkUI'
import { ROUTES } from '../../constants/routes'
import BackLink from '../../ui/BackLink'

export const ForumPage = () => {
  const topics = getTopics()

  return (
    <Page>
      <Helmet>
        <title>Форум</title>
      </Helmet>

      <Title>Форум</Title>
      <BackLink to={ROUTES.main}>
        <span aria-hidden="true">←</span> На главную
      </BackLink>

      <TopicList topics={topics} />

      <LinkUI to={ROUTES.forum.create}>Новая тема</LinkUI>
    </Page>
  )
}

const Page = styled.main`
  width: min(100%, 720px);
  margin: 0 auto;
  padding: clamp(24px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Title = styled.h1`
  margin: 0;
  font-size: 48px;
  text-align: center;
`

export const initForumPage = async () => Promise.resolve()
