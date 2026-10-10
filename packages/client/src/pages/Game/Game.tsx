import type { PageInitArgs } from '../../routes'

import { GameScreen } from '../../game/ui'
import { usePage } from '../../hooks/usePage'
import { initAuth } from '../../modules/auth'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  return <GameScreen />
}

export const initGamePage = async (args: PageInitArgs) => initAuth(args)
