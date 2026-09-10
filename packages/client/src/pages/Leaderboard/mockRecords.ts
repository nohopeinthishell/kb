export type LeaderboardRecord = {
  id: number
  name: string
  money: number
  reputation: number
}

export const MOCK_LEADERBOARD_RECORDS: LeaderboardRecord[] = [
  {
    id: 2,
    name: 'Марина',
    money: 1240,
    reputation: 52,
  },
  {
    id: 1,
    name: 'Артём',
    money: 810,
    reputation: 61,
  },
  {
    id: 7,
    name: 'Никита',
    money: 750,
    reputation: 57,
  },
  {
    id: 3,
    name: 'Илья',
    money: 670,
    reputation: 48,
  },
  {
    id: 5,
    name: 'Дмитрий',
    money: 540,
    reputation: 44,
  },
  {
    id: 8,
    name: 'Елена',
    money: 500,
    reputation: 39,
  },
  {
    id: 6,
    name: 'Ксения',
    money: -120,
    reputation: 31,
  },
  {
    id: 4,
    name: 'Софья',
    money: -40,
    reputation: 22,
  },
]
