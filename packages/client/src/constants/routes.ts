import { generatePath } from 'react-router-dom'

export const ROUTES = {
  main: '/',
  game: '/game',
  leaderboard: '/leaderboard',
  forum: {
    root: '/forum',
    create: '/forum/new',
    topic: '/forum/:topicId',
  },
  profile: '/profile',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const

export const topicPath = (topicId: number) => {
  return generatePath(ROUTES.forum.topic, { topicId: String(topicId) })
}
