export type GameState = {
  week: number
  money: number
  reputation: number

  provisionWeeks: number

  status: 'playing' | 'won' | 'lost'
  seed: number

  tavern: {
    tables: TableState[]
    guests: GuestState[]
    queueSize: number
    helperActive: boolean
  }

  lastActionError: ActionError | null
}

export type GuestState = {
  id: number
  tableId: number
  mood: 'happy' | 'neutral' | 'unhappy'
}

export type TableState = {
  id: number
  condition: 'new' | 'worn' | 'broken'
}

export type GameAction =
  | { type: 'repairTable'; tableId: number }
  | { type: 'hireHelper' }
  | { type: 'buyProvision' }

export type ActionError =
  | 'TABLE_NOT_FOUND'
  | 'TABLE_NOT_BROKEN'
  | 'NOT_ENOUGH_GOLD'
  | 'HELPER_ALREADY_ACTIVE'
  | 'PROVISIONS_ALREADY_ACTIVE'
