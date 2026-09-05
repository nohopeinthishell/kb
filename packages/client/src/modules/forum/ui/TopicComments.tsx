import { Topic } from '../types'
import { useState } from 'react'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'
import { createComment } from '../api/topics'

type Props = {
  topic: Topic
}
export const TopicComments = ({ topic }: Props) => {
  const [comments, setComments] = useState(() => [...topic.comments])
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (text: string) => {
    setError(null)
    try {
      const comment = await createComment(topic.id, text)
      setComments(prev => [...prev, comment])
    } catch (e) {
      setError('Не удалось оставить комментарий')
      throw e
    }
  }

  return (
    <>
      <h2>Ответов: {comments.length}</h2>
      <CommentList comments={comments} />
      <CommentForm error={error} onSubmit={handleAdd} />
    </>
  )
}
