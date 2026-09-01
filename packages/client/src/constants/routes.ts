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
