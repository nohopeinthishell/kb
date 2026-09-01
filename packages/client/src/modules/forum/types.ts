export type Comment = {
  id: number
  topicId: number
  authorLogin: string
  text: string
  createdAt: string
}

export type Topic = {
  id: number
  title: string
  authorLogin: string
  createdAt: string
  comments: Comment[]
}
