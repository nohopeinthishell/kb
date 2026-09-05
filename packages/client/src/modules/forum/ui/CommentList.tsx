import styled from 'styled-components'
import { Comment } from '../types'
import { CommentRow } from './CommentRow'

type Props = {
  comments: Comment[]
}

export const CommentList = ({ comments }: Props) => {
  if (comments.length === 0) {
    return <Empty>Пока нет ни одного комментария. Будь первым.</Empty>
  }
  return (
    <List>
      {comments.map(comment => (
        <CommentRow key={comment.id} comment={comment} />
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
