import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ROUTES } from './constants/routes'
import { GameScreen } from './game/ui'
import { SignInPage } from './pages/SignIn'
import { SignUpPage } from './pages/SignUp'
import { ForumPage, initForumPage } from './pages/Forum'
import { TopicPage, initTopicPage } from './pages/Topic'

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
    path: ROUTES.signIn,
    Component: SignInPage,
  },
  {
    path: ROUTES.signUp,
    Component: SignUpPage,
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
  {
    path: ROUTES.forum.root,
    Component: ForumPage,
    fetchData: initForumPage,
  },
  {
    path: ROUTES.forum.topic,
    Component: TopicPage,
    fetchData: initTopicPage,
  },
]
