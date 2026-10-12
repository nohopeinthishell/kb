import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { LeaderboardRecord } from '../api/leaderboard'
import { fetchLeaderboard } from '../modules/leaderboard'

type LeaderboardState = {
  records: LeaderboardRecord[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
}

const initialState: LeaderboardState = {
  records: [],
  isLoading: false,
  error: null,
  hasMore: true,
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboard.pending, (state, action) => {
        state.isLoading = true
        state.error = null
        if (!action.meta.arg.cursor) {
          state.records = []
          state.hasMore = true
        }
      })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload, meta }) => {
        state.records = meta.arg.cursor
          ? [...state.records, ...payload]
          : payload
        state.hasMore = payload.length === 10
        state.isLoading = false
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.payload ?? action.error.message ?? 'Неизвестная ошибка'
      })
  },
})

export const selectLeaderboardRecords = (state: RootState) =>
  state.leaderboard.records

export const selectLeaderboardIsLoading = (state: RootState) =>
  state.leaderboard.isLoading

export const selectLeaderboardError = (state: RootState) =>
  state.leaderboard.error

export const selectLeaderboardHasMore = (state: RootState) =>
  state.leaderboard.hasMore

export default leaderboardSlice.reducer
