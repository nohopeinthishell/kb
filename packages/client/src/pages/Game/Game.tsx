import type { PageInitArgs } from '../../routes'

import { GameScreen } from '../../game/ui'
import { initAuth } from '../../modules/auth'

export const GamePage = () => <GameScreen />

export const initGamePage = async (args: PageInitArgs) => initAuth(args)
