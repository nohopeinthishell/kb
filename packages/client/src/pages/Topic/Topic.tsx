import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { formatDate, getTopic } from '../../modules/forum'
import { ROUTES } from '../../constants/routes'
import { NotFoundPage } from '../NotFound'

export const TopicPage = () => {
  const { topicId } = useParams()
  const id = Number(topicId)
  const topic = Number.isInteger(id) && id > 0 ? getTopic(id) : null

  if (!topic) {
    return <NotFoundPage />
  }

  return (
    <Page>
      <Helmet>
        <title>{topic.title}</title>
      </Helmet>

      <BackLink to={ROUTES.forum.root}>
        <span aria-hidden="true">←</span> К списку тем
      </BackLink>

      <Header>
        <Title>{topic.title}</Title>
        <Meta>
          <span>{topic.authorLogin}</span>
          <time dateTime={topic.createdAt}>{formatDate(topic.createdAt)}</time>
          <span>Ответов: {topic.comments.length}</span>
        </Meta>
      </Header>

      {/* Комментарии */}
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

const BackLink = styled(Link)`
  align-self: start;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text.link};
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.2;

  /* Заголовок темы пишет пользователь: длинное слово не должно рвать вёрстку. */
  overflow-wrap: anywhere;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`

export const initTopicPage = async () => Promise.resolve()
