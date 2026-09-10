import { initialGameState } from './config'
import { applyRandomEventSelection } from './events'
import { GameState } from './types'

export const createNewGameState = (): GameState =>
  applyRandomEventSelection({
    ...initialGameState,
    seed: Math.floor(Math.random() * 2147483646) + 1,
  })
