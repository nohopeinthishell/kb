import { Router } from 'express'
import {
  getTopics,
  createTopic,
  getTopic,
  deleteTopic,
  getComments,
  createComment,
  deleteComment,
  createReaction,
  deleteReaction,
} from '../controlles'

export const forumRouter = Router()

forumRouter.get('/topics', getTopics)

forumRouter.post('/topics', createTopic)

forumRouter.get('/topics/:topicId', getTopic)

forumRouter.delete('/topics/:topicId', deleteTopic)

forumRouter.get('/comments', getComments)

forumRouter.post('/comments', createComment)

forumRouter.delete('/comments/:commentId', deleteComment)

forumRouter.post('/reactions', createReaction)

forumRouter.delete('/reactions/:reactionId', deleteReaction)
