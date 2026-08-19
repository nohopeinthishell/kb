import { GameState, GameAction, ActionError, WeekCalculation } from './types'
import { applyAction } from './actions'
import { initialGameState } from './config'
import { forecast } from './forecast'
import { tick } from './tick'

export { tick, applyAction, forecast, initialGameState }

export type { GameState, GameAction, ActionError, WeekCalculation }
