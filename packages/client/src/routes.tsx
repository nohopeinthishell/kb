import { Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'

import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ROUTES } from './constants/routes'
import { GamePage, initGamePage } from './pages/Game'
import { initSignInPage, SignInPage } from './pages/SignIn'
import { initSignUpPage, SignUpPage } from './pages/SignUp'
import { initProfilePage, ProfilePage } from './pages/Profile'
import { initLeaderboardPage, LeaderboardPage } from './pages/Leaderboard'
import { ForumPage, initForumPage } from './pages/Forum'
import { TopicPage, initTopicPage } from './pages/Topic'
import { NewTopicPage, initNewTopicPage } from './pages/NewTopic'
import {
  OAuthCallbackRoute,
  ProtectedRoute,
  PublicOnlyRoute,
} from './modules/auth'
import { initStartGamePage, StartGamePage } from './pages/StartGame'
import { ServerError, initServerErrorPage } from './pages/ServerError'

export type PageInitContext = {
  clientToken?: string
  cookie?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

type AppRoute = {
  path: string
  element: ReactElement
  fetchData?: (args: PageInitArgs) => Promise<void>
}

export const routes: AppRoute[] = [
  {
    path: ROUTES.main,
    element: (
      <OAuthCallbackRoute>
        <ProtectedRoute>
          <MainPage />
        </ProtectedRoute>
      </OAuthCallbackRoute>
    ),
    fetchData: initMainPage,
  },
  {
    path: ROUTES.signIn,
    element: (
      <PublicOnlyRoute>
        <SignInPage />
      </PublicOnlyRoute>
    ),
    fetchData: initSignInPage,
  },
  {
    path: ROUTES.signUp,
    element: (
      <PublicOnlyRoute>
        <SignUpPage />
      </PublicOnlyRoute>
    ),
    fetchData: initSignUpPage,
  },
  {
    path: ROUTES.profile,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    fetchData: initProfilePage,
  },
  {
    path: ROUTES.leaderboard,
    element: (
      <ProtectedRoute>
        <LeaderboardPage />
      </ProtectedRoute>
    ),
    fetchData: initLeaderboardPage,
  },
  {
    path: ROUTES.serverError,
    element: (
      <ProtectedRoute>
        <ServerError />
      </ProtectedRoute>
    ),
    fetchData: initServerErrorPage,
  },
  {
    path: ROUTES.startGame,
    element: (
      <ProtectedRoute>
        <StartGamePage />
      </ProtectedRoute>
    ),
    fetchData: initStartGamePage,
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <NotFoundPage />
      </ProtectedRoute>
    ),
    fetchData: initNotFoundPage,
  },
  {
    path: ROUTES.game,
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    fetchData: initGamePage,
  },
  {
    path: ROUTES.forum.root,
    element: (
      <ProtectedRoute>
        <ForumPage />
      </ProtectedRoute>
    ),
    fetchData: initForumPage,
  },
  {
    path: ROUTES.forum.topic,
    element: (
      <ProtectedRoute>
        <TopicPage />
      </ProtectedRoute>
    ),
    fetchData: initTopicPage,
  },
  {
    path: ROUTES.forum.create,
    element: (
      <ProtectedRoute>
        <NewTopicPage />
      </ProtectedRoute>
    ),
    fetchData: initNewTopicPage,
  },
]

export const AppRoutes = () => (
  <Routes>
    {routes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Routes>
)
