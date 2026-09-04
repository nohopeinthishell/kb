import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ROUTES } from './constants/routes'
import { GameScreen } from './game/ui'
import { SignInPage } from './pages/SignIn'
import { SignUpPage } from './pages/SignUp'
import { initProfilePage, ProfilePage } from './pages/Profile'
import { ServerError } from './pages/ServerError'

export type PageInitContext = {
  clientToken?: string
  cookie?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: ROUTES.main,
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: ROUTES.signIn,
    Component: SignInPage,
  },
  {
    path: ROUTES.signUp,
    Component: SignUpPage,
  },
  {
    path: ROUTES.profile,
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
  {
    path: ROUTES.serverError,
    Component: ServerError,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
  {
    path: ROUTES.game,
    Component: GameScreen,
  },
]
