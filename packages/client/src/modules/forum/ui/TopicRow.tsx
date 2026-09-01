import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { topicPath } from '../../../constants/routes'
import { Topic } from '../types'

type Props = {
  topic: Topic
}

export const TopicRow = ({ topic }: Props) => (
  <Row>
    <Title>
      <TitleLink to={topicPath(topic.id)}>{topic.title}</TitleLink>
    </Title>

    <Meta>
      <span>{topic.authorLogin}</span>
      <time dateTime={topic.createdAt}>{topic.createdAt}</time>
      <span>Ответов: {topic.comments.length}</span>
    </Meta>
  </Row>
)

const Row = styled.li`
  padding: 16px 20px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;

  /* Заголовок темы длиной в абзац не должен растягивать строку по горизонтали:
     переносим по словам, а неразрывную «простыню» ломаем принудительно. */
  overflow-wrap: anywhere;
`

const TitleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text.link};
      text-decoration: underline;
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`
