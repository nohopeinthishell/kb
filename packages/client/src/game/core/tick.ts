import {
  calculateRandomGuests,
  calculateReputationDelta,
  createGuests,
  degradeTable,
} from './actions'
import { applyRandomEventSelection } from './events'
import { calculateWeek, getGuestsByReputation } from './forecast'
import { GameState } from './types'

type ResolveWeekOptions = {
  degradeTables?: boolean
}

export const resolveWeek = (
  state: GameState,
  options: ResolveWeekOptions = {}
): GameState => {
  const degradeTables = options.degradeTables ?? true
  const expectedGuestCount = getGuestsByReputation(state.reputation)
  const randomGuests = calculateRandomGuests(state.seed, expectedGuestCount)
  const tableDegradation = degradeTables
    ? degradeTable(randomGuests.nextSeed, state.tavern.tables)
    : { tables: state.tavern.tables, nextSeed: randomGuests.nextSeed }

  const stateWithDegradedTables: GameState = {
    ...state,
    tavern: {
      ...state.tavern,
      tables: tableDegradation.tables,
    },
  }

  const {
    seatedGuestCount,
    queueSize,
    servedGuestCount,
    income,
    expenses,
    workingTables,
  } = calculateWeek(stateWithDegradedTables, randomGuests.guestCount)

  const guests = createGuests(seatedGuestCount, servedGuestCount, workingTables)

  const brokenTables = tableDegradation.tables.filter(
    table => table.condition === 'broken'
  ).length

  const reputationDelta = calculateReputationDelta(
    guests,
    queueSize,
    brokenTables
  )

  const reputation = Math.min(
    100,
    Math.max(0, state.reputation + reputationDelta)
  )

  const money = state.money + income - expenses

  return {
    ...state,
    money,
    reputation,
    seed: tableDegradation.nextSeed,
    lastActionError: null,
    tavern: {
      ...state.tavern,
      tables: tableDegradation.tables,
      guests,
      queueSize,
      helperActive: false,
    },
    status: money < 0 ? 'lost' : state.status,
  }
}

export const tick = (state: GameState): GameState => {
  if (state.status !== 'playing') return state

  if (state.currentEventId !== null) {
    return { ...state, lastActionError: 'EVENT_CHOICE_REQUIRED' }
  }

  const resolved = resolveWeek(state)
  const isFinalWeek = state.week >= 6
  const stateAfterWeek: GameState = {
    ...resolved,
    week: isFinalWeek ? 6 : state.week + 1,
    provisionWeeks: state.provisionWeeks > 0 ? state.provisionWeeks - 1 : 0,
    currentEventId: null,
    eventPhase: 'none',
  }

  if (stateAfterWeek.money < 0) {
    return { ...stateAfterWeek, status: 'lost' }
  }

  if (isFinalWeek) {
    return { ...stateAfterWeek, status: 'won' }
  }

  return applyRandomEventSelection(stateAfterWeek)
}
