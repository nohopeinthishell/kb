import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import { HelmetProvider, HelmetServerState } from 'react-helmet-async'
import { Request as ExpressRequest } from 'express'
import { StaticRouter } from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'

import { createContext, createUrl } from './entry-server.utils'
import { createStore } from './store'
import { AppRoutes, routes } from './routes'
import { GlobalStyle, theme } from './theme'
import './assets/css/index.css'
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import ErrorBoundary from './components/ErrorBoundary'

export const render = async (req: ExpressRequest) => {
  const store = createStore()
  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url)
  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  const matchedRoute = foundRoutes[foundRoutes.length - 1].route
  const statusCode = matchedRoute.path === '*' ? 404 : 200
  const fetchData = matchedRoute.fetchData

  try {
    if (fetchData) {
      await fetchData({
        dispatch: store.dispatch,
        state: store.getState(),
        ctx: createContext(req),
      })
    }
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  const sheet = new ServerStyleSheet()
  const helmetContext: { helmet?: HelmetServerState } = {}
  try {
    const html = ReactDOM.renderToString(
      sheet.collectStyles(
        <HelmetProvider context={helmetContext}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Provider store={store}>
              <ErrorBoundary>
                <StaticRouter location={`${url.pathname}${url.search}`}>
                  <AppRoutes />
                </StaticRouter>
              </ErrorBoundary>
            </Provider>
          </ThemeProvider>
        </HelmetProvider>
      )
    )
    const styleTags = sheet.getStyleTags()

    return {
      html,
      statusCode,
      helmet: helmetContext.helmet as HelmetServerState,
      styleTags,
      initialState: store.getState(),
    }
  } finally {
    sheet.seal()
  }
}
