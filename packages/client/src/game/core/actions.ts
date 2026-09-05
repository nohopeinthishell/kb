import {
  BROKEN_TABLE_REPUTATION_PENALTY,
  GOLD_TO_BUY_PROVISION,
  GOLD_TO_FIX_TABLE,
  GOLD_TO_HIRE_HELPER,
  MOOD_REPUTATION_DELTA,
  PROVISION_DURATION_WEEKS,
  QUEUE_REPUTATION_PENALTY,
  RANDOM_GUEST_OFFSETS,
  TABLE_CAPACITY,
  TABLE_DEGRADATION_CHANCE,
} from './constants'
import { nextRandom } from './random'
import {
  GameAction,
  GameState,
  GuestState,
  RandomGuestsResult,
  TableDegradationResult,
  TableState,
  EventEffectType,
} from './types'
import { EVENTS } from './events'

export const applyAction = (
  state: GameState,
  action: GameAction
): GameState => {
  if (state.status !== 'playing') return state

  if (state.currentEventId !== null && action.type !== 'event') return state

  switch (action.type) {
    case 'repairTable': {
      const tableToRepair =
        state.tavern.tables.find(table => table.condition === 'broken') ??
        state.tavern.tables.find(table => table.condition === 'worn')

      if (!tableToRepair) {
        return { ...state, lastActionError: 'TABLE_DOES_NOT_NEED_REPAIR' }
      }

      if (state.money < GOLD_TO_FIX_TABLE) {
        return { ...state, lastActionError: 'NOT_ENOUGH_GOLD' }
      }

      return {
        ...state,
        money: state.money - GOLD_TO_FIX_TABLE,
        tavern: {
          ...state.tavern,
          tables: state.tavern.tables.map(table =>
            table.id === tableToRepair.id
              ? { ...table, condition: 'new' }
              : table
          ),
        },
        lastActionError: null,
      }
    }

    case 'hireHelper': {
      if (state.tavern.helperActive) {
        return { ...state, lastActionError: 'HELPER_ALREADY_ACTIVE' }
      }
      if (state.money < GOLD_TO_HIRE_HELPER) {
        return { ...state, lastActionError: 'NOT_ENOUGH_GOLD' }
      }

      return {
        ...state,
        money: state.money - GOLD_TO_HIRE_HELPER,
        tavern: {
          ...state.tavern,
          helperActive: true,
        },
        lastActionError: null,
      }
    }

    case 'buyProvision': {
      if (state.provisionWeeks > 0) {
        return { ...state, lastActionError: 'PROVISIONS_ALREADY_ACTIVE' }
      }

      if (state.money < GOLD_TO_BUY_PROVISION) {
        return { ...state, lastActionError: 'NOT_ENOUGH_GOLD' }
      }

      return {
        ...state,
        money: state.money - GOLD_TO_BUY_PROVISION,
        provisionWeeks: PROVISION_DURATION_WEEKS,
        lastActionError: null,
      }
    }

    case 'event': {
      if (state.currentEventId !== action.eventId) return state

      const foundEvent = EVENTS.find(event => event.id === action.eventId)

      if (!foundEvent) return state

      const chosenVariant = foundEvent.choices.find(
        choice => choice.id === action.choiceId
      )

      if (!chosenVariant) return state

      const effects = chosenVariant.effects

      const changedFields = effects.reduce<Pick<GameState, EventEffectType>>(
        (acc, effect) => {
          const { type, value } = effect
          return {
            ...acc,
            [type]: acc[type] + value,
          }
        },
        {
          money: state.money,
          reputation: state.reputation,
        }
      )

      const reputation = Math.min(100, Math.max(0, changedFields.reputation))

      return {
        ...state,
        money: changedFields.money,
        reputation,
        status: changedFields.money < 0 ? 'lost' : state.status,
        currentEventId: null,
        eventPhase: 'resolved',
        lastActionError: null,
      }
    }

    default:
      return state
  }
}

export const createGuests = (
  seatedGuestCount: number,
  servedGuestCount: number,
  workingTables: TableState[]
): GuestState[] => {
  const guests: GuestState[] = []

  for (let count = 0; count < seatedGuestCount; count++) {
    const tableIndex = Math.floor(count / TABLE_CAPACITY)

    const table = workingTables[tableIndex]

    const isTableWorn = table?.condition === 'worn'

    const mood =
      count >= servedGuestCount ? 'unhappy' : isTableWorn ? 'neutral' : 'happy'

    if (table) {
      guests.push({
        id: count,
        tableId: table.id,
        mood,
      })
    }
  }

  return guests
}

export const calculateReputationDelta = (
  guests: GuestState[],
  queueSize: number,
  brokenTables: number
): number => {
  const totalMoodDelta = guests.reduce((acc, guest) => {
    return acc + MOOD_REPUTATION_DELTA[guest.mood]
  }, 0)

  const averageMoodDelta =
    guests.length === 0 ? 0 : totalMoodDelta / guests.length

  return Math.round(
    averageMoodDelta -
      QUEUE_REPUTATION_PENALTY * queueSize -
      BROKEN_TABLE_REPUTATION_PENALTY * brokenTables
  )
}

export const degradeTable = (
  seed: number,
  tables: TableState[]
): TableDegradationResult => {
  const { value, nextSeed } = nextRandom(seed)

  if (value >= TABLE_DEGRADATION_CHANCE) {
    return { tables, nextSeed }
  }

  const degradableTables = tables.filter(t => t.condition !== 'broken')

  if (degradableTables.length === 0) {
    return { tables, nextSeed }
  }

  const selectionRandom = nextRandom(nextSeed)
  const tableIndex = Math.floor(selectionRandom.value * degradableTables.length)
  const tableToDegrade = degradableTables[tableIndex]

  if (!tableToDegrade) {
    return { tables, nextSeed: selectionRandom.nextSeed }
  }

  const newTables: TableState[] = tables.map(t => {
    if (tableToDegrade.id === t.id) {
      return { ...t, condition: t.condition === 'new' ? 'worn' : 'broken' }
    }

    return t
  })

  return { tables: newTables, nextSeed: selectionRandom.nextSeed }
}

export const calculateRandomGuests = (
  seed: number,
  expectedGuestCount: number
): RandomGuestsResult => {
  const { value, nextSeed } = nextRandom(seed)

  const index = Math.floor(value * RANDOM_GUEST_OFFSETS.length)
  const offset = RANDOM_GUEST_OFFSETS[index] ?? 0

  return {
    guestCount: Math.max(0, expectedGuestCount + offset),
    nextSeed,
  }
}
