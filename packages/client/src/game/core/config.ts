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
      { id: 2, condition: 'broken' },
      { id: 3, condition: 'worn' },
      { id: 4, condition: 'new' },
    ],
    guests: [
      { id: 0, tableId: 1, mood: 'happy' },
      { id: 1, tableId: 1, mood: 'happy' },
      { id: 2, tableId: 1, mood: 'neutral' },
      { id: 3, tableId: 1, mood: 'unhappy' },
      { id: 4, tableId: 3, mood: 'neutral' },
      { id: 5, tableId: 3, mood: 'neutral' },
      { id: 6, tableId: 4, mood: 'happy' },
      { id: 7, tableId: 4, mood: 'happy' },
    ],
    queueSize: 0,
    helperActive: false,
  },

  lastActionError: null,

  currentEventId: null,
}
