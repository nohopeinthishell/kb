import styled from 'styled-components'

import { Topic } from '../types'
import { TopicRow } from './TopicRow'

type Props = {
  topics: Topic[]
}

export const TopicList = ({ topics }: Props) => {
  if (topics.length === 0) {
    return <Empty>Пока нет ни одной темы. Создай первую.</Empty>
  }

  return (
    <List>
      {topics.map(topic => (
        <TopicRow key={topic.id} topic={topic} />
      ))}
    </List>
  )
}

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Empty = styled.p`
  margin: 0;
  padding: 32px 20px;

  border: 1px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`
