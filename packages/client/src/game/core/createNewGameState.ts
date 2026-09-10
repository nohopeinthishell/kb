import { initialGameState } from './config'
import { GameState } from './types'

export const createNewGameState = (): GameState => ({
  ...initialGameState,
  seed: Math.floor(Math.random() * 2147483646) + 1,
})
