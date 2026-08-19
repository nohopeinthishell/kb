import { GameState } from './types'

export const initialGameState: GameState = {
  week: 1,
  money: 1000,
  reputation: 50,
  provisionWeeks: 0,
  status: 'playing',
  seed: 1,

  tavern: {
    tables: [
      { id: 1, condition: 'new' },
      { id: 2, condition: 'new' },
      { id: 3, condition: 'new' },
      { id: 4, condition: 'new' },
    ],
    guests: [],
    queueSize: 0,
    helperActive: false,
  },

  lastActionError: null,
}
