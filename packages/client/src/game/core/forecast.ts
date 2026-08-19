import {
  BASE_SERVICE_CAPACITY,
  GOLD_PER_GUEST,
  GUESTS_BY_REPUTATION,
  HELPER_SERVICE_CAPACITY,
  PROVISION_MULTIPLIER,
  TABLE_CAPACITY,
  WEEKLY_EXPENSES,
} from './constants'
import { GameState, SeatingResult, TableState, WeekCalculation } from './types'

export const forecast = (state: GameState): WeekCalculation => {
  const serviceCapacity = state.tavern.helperActive
    ? HELPER_SERVICE_CAPACITY
    : BASE_SERVICE_CAPACITY

  const guestCount = getGuestsByReputation(state.reputation)

  const { queueSize, seatedGuestCount } = calculateSeating(
    guestCount,
    state.tavern.tables
  )

  const servedGuestCount = Math.min(seatedGuestCount, serviceCapacity)

  const unservedGuestCount = seatedGuestCount - servedGuestCount

  let income = servedGuestCount * GOLD_PER_GUEST

  if (state.provisionWeeks > 0) {
    income *= PROVISION_MULTIPLIER
  }

  income = Math.round(income)

  const expenses = WEEKLY_EXPENSES

  return {
    guestCount,
    seatedGuestCount,
    queueSize,
    servedGuestCount,
    unservedGuestCount,
    income,
    expenses,
  }
}

const getGuestsByReputation = (reputation: number): number => {
  const normalizedReputation = Math.max(0, Math.min(100, reputation))

  const range = GUESTS_BY_REPUTATION.find(
    item => item.min <= normalizedReputation && normalizedReputation <= item.max
  )

  return range?.guests ?? 5
}

const calculateSeating = (
  guests: number,
  tables: TableState[]
): SeatingResult => {
  const workingTables = tables.filter(table => table.condition !== 'broken')

  const capacity = workingTables.length * TABLE_CAPACITY

  const seatedGuestCount = Math.min(guests, capacity)

  const queueSize = Math.max(0, guests - capacity)

  return { queueSize, seatedGuestCount }
}
