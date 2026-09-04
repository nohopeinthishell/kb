import {
  calculateRandomGuests,
  calculateReputationDelta,
  createGuests,
  degradeTable,
} from './actions'
import { checkEventConditions, EVENTS, selectRandomEvent } from './events'
import { calculateWeek, getGuestsByReputation } from './forecast'
import { GameState } from './types'

export const tick = (state: GameState): GameState => {
  if (state.status !== 'playing') return state

  if (state.currentEventId !== null) {
    return { ...state, lastActionError: 'EVENT_CHOICE_REQUIRED' }
  }

  const expectedGuestCount = getGuestsByReputation(state.reputation)
  const randomGuests = calculateRandomGuests(state.seed, expectedGuestCount)
  const tableDegradation = degradeTable(
    randomGuests.nextSeed,
    state.tavern.tables
  )

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

  const isFinalWeek = state.week >= 6
  const stateAfterWeek: GameState = {
    ...state,
    money: state.money + income - expenses,
    reputation,
    seed: tableDegradation.nextSeed,
    week: isFinalWeek ? 6 : state.week + 1,
    provisionWeeks: state.provisionWeeks > 0 ? state.provisionWeeks - 1 : 0,
    lastActionError: null,
    currentEventId: null,
    eventPhase: 'none',
    tavern: {
      ...state.tavern,
      tables: tableDegradation.tables,
      guests,
      queueSize,
      helperActive: false,
    },
  }

  if (stateAfterWeek.money < 0) {
    return { ...stateAfterWeek, status: 'lost' }
  }

  if (isFinalWeek) {
    return { ...stateAfterWeek, status: 'won' }
  }

  const availableEvents = EVENTS.filter(
    event =>
      !stateAfterWeek.usedEventIds.includes(event.id) &&
      event.selection === 'random' &&
      checkEventConditions(event.conditions, stateAfterWeek)
  )
  const selectedEvent = selectRandomEvent(stateAfterWeek.seed, availableEvents)

  return {
    ...stateAfterWeek,
    seed: selectedEvent.nextSeed,
    currentEventId: selectedEvent.eventId,
    eventPhase: selectedEvent.eventId ? 'pending' : 'none',
    usedEventIds: selectedEvent.eventId
      ? [...stateAfterWeek.usedEventIds, selectedEvent.eventId]
      : stateAfterWeek.usedEventIds,
  }
}
