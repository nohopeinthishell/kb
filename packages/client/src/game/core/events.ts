import rawEvents from '../events.json'
import { nextRandom } from './random'
import type { Condition, GameEvent, GameState } from './types'

export const EVENTS = rawEvents as GameEvent[]

type EventSelection = {
  eventId: string | null
  nextSeed: number
}

export const selectRandomEvent = (
  seed: number,
  events: GameEvent[]
): EventSelection => {
  if (events.length === 0) {
    return { eventId: null, nextSeed: seed }
  }

  const { value, nextSeed } = nextRandom(seed)
  const index = Math.floor(value * events.length)

  return {
    eventId: events[index]?.id ?? null,
    nextSeed,
  }
}

export const checkEventConditions = (
  conditions: Condition[],
  state: GameState
): boolean => {
  return conditions.every(condition => {
    switch (condition.type) {
      case 'stat':
        return condition.operator === 'gte'
          ? state[condition.field] >= condition.value
          : state[condition.field] <= condition.value
    }
  })
}

export const applyRandomEventSelection = (state: GameState): GameState => {
  const availableEvents = EVENTS.filter(
    event =>
      !state.usedEventIds.includes(event.id) &&
      event.selection === 'random' &&
      checkEventConditions(event.conditions, state)
  )
  const selectedEvent = selectRandomEvent(state.seed, availableEvents)

  return {
    ...state,
    seed: selectedEvent.nextSeed,
    currentEventId: selectedEvent.eventId,
    eventPhase: selectedEvent.eventId ? 'pending' : 'none',
    usedEventIds: selectedEvent.eventId
      ? [...state.usedEventIds, selectedEvent.eventId]
      : state.usedEventIds,
  }
}
