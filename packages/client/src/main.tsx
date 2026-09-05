import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import { store } from './store'

import { routes } from './routes'
import { GlobalStyle, theme } from './theme'
import './assets/css/index.css'
import ErrorBoundary from './components/ErrorBoundary'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Provider store={store}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Provider>
    </ThemeProvider>
  </HelmetProvider>
)
