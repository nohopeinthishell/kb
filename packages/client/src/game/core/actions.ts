import {
  GOLD_TO_BUY_PROVISION,
  GOLD_TO_FIX_TABLE,
  GOLD_TO_HIRE_HELPER,
  PROVISION_DURATION_WEEKS,
} from './constants'
import { GameAction, GameState } from './types'

export const applyAction = (
  state: GameState,
  action: GameAction
): GameState => {
  if (state.status !== 'playing') return state

  switch (action.type) {
    case 'repairTable': {
      const tableToRepair = state.tavern.tables.find(
        t => t.id === action.tableId
      )

      if (!tableToRepair) {
        return { ...state, lastActionError: 'TABLE_NOT_FOUND' }
      }

      if (tableToRepair.condition === 'new') {
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
            table.id === action.tableId ? { ...table, condition: 'new' } : table
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

    default:
      return state
  }
}
