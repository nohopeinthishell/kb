import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import ssrReducer from './slices/ssrSlice'
import userReducer from './slices/userSlice'
import leaderboardReducer from './slices/leaderboardSlice'

export const reducer = combineReducers({
  ssr: ssrReducer,
  user: userReducer,
  leaderboard: leaderboardReducer,
})

export type RootState = ReturnType<typeof reducer>

declare global {
  interface Window {
    APP_INITIAL_STATE?: RootState
  }
}

export const createStore = (preloadedState?: RootState) =>
  configureStore({
    reducer,
    preloadedState,
  })

export type AppStore = ReturnType<typeof createStore>
export type AppDispatch = AppStore['dispatch']

export const useDispatch: () => AppDispatch = useDispatchBase
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase
export const useStore: () => AppStore = useStoreBase
