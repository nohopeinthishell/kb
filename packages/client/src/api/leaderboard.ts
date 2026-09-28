import { request } from './auth'

export type AddUserToLeaderboardData = {
  userId: number
  score: number
  name: string
}

export type GetLeaderboardParams = {
  ratingFieldName?: 'score'
  cursor?: number
  limit?: number
}

export type LeaderboardRecord = {
  data: {
    userId: number
    score: number
    name: string
  }
}

export const getLeaderboard = (
  {
    ratingFieldName = 'score',
    cursor = 0,
    limit = 10,
  }: GetLeaderboardParams = {},
  cookie?: string
) => {
  return request<LeaderboardRecord[]>(
    '/leaderboard/kb',
    {
      method: 'POST',
      body: JSON.stringify({
        ratingFieldName,
        cursor,
        limit,
      }),
    },
    cookie
  )
}

export const addUserToLeaderboard = (data: AddUserToLeaderboardData) => {
  return request('/leaderboard', {
    method: 'POST',
    body: JSON.stringify({
      data,
      ratingFieldName: 'score',
      teamName: 'kb',
    }),
  })
}
