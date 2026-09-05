import styled from 'styled-components'

import { formatDate } from '../lib/formatDate'
import { Comment } from '../types'

type Props = {
  comment: Comment
}

export const CommentRow = ({ comment }: Props) => (
  <Item>
    <Meta>
      <Author>{comment.authorLogin}</Author>
      <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
    </Meta>

    <Text>{comment.text}</Text>
  </Item>
)

const Item = styled.li`
  padding: 16px 20px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  border-radius: 12px;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`

const Author = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
`

const Text = styled.p`
  margin: 0;
  line-height: 1.5;

  /* Текст пишет пользователь: переносы строк сохраняем, длинное слово ломаем. */
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`
