import { initialGameState } from './config'
import { applyRandomEventSelection } from './events'
import { resolveWeek } from './tick'
import { GameState } from './types'

export const createNewGameState = (): GameState => {
  const started = resolveWeek({
    ...initialGameState,
    seed: Math.floor(Math.random() * 2147483646) + 1,
  })

  return applyRandomEventSelection({
    ...started,
    money: initialGameState.money,
    reputation: initialGameState.reputation,
    status: 'playing',
  })
}
