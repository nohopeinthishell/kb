export type LeaderboardRecord = {
  id: number
  name: string
  isWin: boolean
  money: number
  reputation: number
}

export const MOCK_LEADERBOARD_RECORDS: LeaderboardRecord[] = [
  {
    id: 1,
    name: 'Артём',
    isWin: true,
    money: 1420,
    reputation: 61,
  },
  {
    id: 2,
    name: 'Марина',
    isWin: true,
    money: 1760,
    reputation: 52,
  },
  {
    id: 3,
    name: 'Илья',
    isWin: true,
    money: 1150,
    reputation: 48,
  },
  {
    id: 4,
    name: 'Софья',
    isWin: false,
    money: -40,
    reputation: 22,
  },
  {
    id: 5,
    name: 'Дмитрий',
    isWin: true,
    money: 980,
    reputation: 44,
  },
  {
    id: 6,
    name: 'Ксения',
    isWin: false,
    money: -120,
    reputation: 31,
  },
  {
    id: 7,
    name: 'Никита',
    isWin: true,
    money: 1320,
    reputation: 57,
  },
  {
    id: 8,
    name: 'Елена',
    isWin: true,
    money: 890,
    reputation: 39,
  },
]
