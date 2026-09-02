import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ROUTES } from './constants/routes'
import { GamePage, initGamePage } from './pages/Game'
import { initSignInPage, SignInPage } from './pages/SignIn'
import { initSignUpPage, SignUpPage } from './pages/SignUp'
import { initProfilePage, ProfilePage } from './pages/Profile'
import { ProtectedRoute, PublicOnlyRoute } from './modules/auth'

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
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
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
]
