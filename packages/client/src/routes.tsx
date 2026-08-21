import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { initSignInPage, SignInPage } from './pages/SignIn'
import { initSignUpPage, SignUpPage } from './pages/SignUp'

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
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/sign-in',
    Component: SignInPage,
    fetchData: initSignInPage,
  },
  {
    path: '/sign-up',
    Component: SignUpPage,
    fetchData: initSignUpPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
