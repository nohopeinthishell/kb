import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { LeaderboardRecord } from '../api/leaderboard'
import { fetchLeaderboard } from '../modules/leaderboard'

type LeaderboardState = {
  records: LeaderboardRecord[]
  isLoading: boolean
  error: string | null
}

const initialState: LeaderboardState = {
  records: [],
  isLoading: false,
  error: null,
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboard.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload }) => {
        state.records = payload
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

export default leaderboardSlice.reducer
