import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import { createStore } from './store'

import { AppRoutes } from './routes'
import { GlobalStyle, theme } from './theme'
import './assets/css/index.css'
import ErrorBoundary from './components/ErrorBoundary'

const store = createStore(window.APP_INITIAL_STATE)
delete window.APP_INITIAL_STATE

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <HelmetProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Provider store={store}>
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </Provider>
    </ThemeProvider>
  </HelmetProvider>
)
