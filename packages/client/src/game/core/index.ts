import {
  GameState,
  GameAction,
  ActionError,
  GuestState,
  TableState,
  WeekCalculation,
} from './types'
import { applyAction } from './actions'
import { initialGameState } from './config'
import { createNewGameState } from './createNewGameState'
import { forecast } from './forecast'
import { tick } from './tick'
import { calculateScore } from './score'

export {
  tick,
  applyAction,
  forecast,
  initialGameState,
  calculateScore,
  createNewGameState,
}

export type {
  GameState,
  GameAction,
  ActionError,
  GuestState,
  TableState,
  WeekCalculation,
}
