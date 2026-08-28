import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ROUTES } from './constants/routes'
import { initStartGamePage, StartGamePage } from './pages/StartGame'

export type PageInitContext = {
  clientToken?: string
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
    path: ROUTES.startGame,
    Component: StartGamePage,
    fetchData: initStartGamePage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
