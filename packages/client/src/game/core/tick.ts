import { calculateReputationDelta, createGuests, forecast } from './forecast'
import { GameState } from './types'

export const tick = (state: GameState): GameState => {
  if (state.status !== 'playing') return state

  const {
    seatedGuestCount,
    queueSize,
    servedGuestCount,
    income,
    expenses,
    workingTables,
  } = forecast(state)

  const guests = createGuests(seatedGuestCount, servedGuestCount, workingTables)

  const brokenTables = state.tavern.tables.length - workingTables.length

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

  const newState: GameState = {
    ...state,
    money: state.money + income - expenses,
    reputation,
    week: isFinalWeek ? 6 : state.week + 1,
    provisionWeeks: state.provisionWeeks > 0 ? state.provisionWeeks - 1 : 0,
    lastActionError: null,
    tavern: {
      ...state.tavern,
      guests,
      queueSize,
      helperActive: false,
    },
  }

  if (newState.money < 0) return { ...newState, status: 'lost' }

  if (isFinalWeek) return { ...newState, status: 'won' }

  return newState
}
