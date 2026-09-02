import { Topic } from '../types'
import { useState } from 'react'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'

type Props = {
  topic: Topic
}
export const TopicComments = ({ topic }: Props) => {
  const [comments, setComments] = useState(topic.comments)

  const onCommentSubmit = (text: string) => console.log(text)

  return (
    <>
      <CommentList comments={comments} />
      <CommentForm onSubmit={onCommentSubmit} />
    </>
  )
}
