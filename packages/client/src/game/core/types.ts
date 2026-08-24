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

  currentEventId: string | null

  usedEventIds: string[]
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
  | { type: 'repairTable' }
  | { type: 'hireHelper' }
  | { type: 'buyProvision' }
  | { type: 'event'; eventId: string; choiceId: string }

export type ActionError =
  | 'TABLE_DOES_NOT_NEED_REPAIR'
  | 'NOT_ENOUGH_GOLD'
  | 'HELPER_ALREADY_ACTIVE'
  | 'PROVISIONS_ALREADY_ACTIVE'
  | 'EVENT_CHOICE_REQUIRED'

export type SeatingResult = {
  seatedGuestCount: number
  queueSize: number
  workingTables: TableState[]
}

export type WeekCalculation = {
  guestCount: number
  seatedGuestCount: number
  queueSize: number
  servedGuestCount: number
  unservedGuestCount: number
  income: number
  expenses: number
  workingTables: TableState[]
}

export type RandomResult = {
  value: number
  nextSeed: number
}

export type RandomGuestsResult = {
  guestCount: number
  nextSeed: number
}

export type TableDegradationResult = {
  tables: TableState[]
  nextSeed: number
}

export type GameEvent = {
  id: string
  title: string
  description: string
  weight: number
  conditions: []
  choices: EventChoice[]
  selection: 'random' | 'scheduled'
}

export type EventEffectType = 'money' | 'reputation'

export type EventEffect = {
  type: EventEffectType
  value: number
}

export type EventChoice = {
  id: string
  label: string
  hint: string
  effects: EventEffect[]
}

export type Condition = {
  type: 'stat'
  field: EventEffectType
  operator: 'gte' | 'lte'
  value: number
}
