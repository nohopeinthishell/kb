import { createAsyncThunk } from '@reduxjs/toolkit'
import { getLeaderboard, type LeaderboardRecord } from '../../api'

export const fetchLeaderboard = createAsyncThunk<
  LeaderboardRecord[],
  { cookie?: string; cursor?: number },
  { rejectValue: string }
>(
  'leaderboard/fetchAll',
  async ({ cookie, cursor = 0 }, { rejectWithValue }) => {
    try {
      return await getLeaderboard({ cursor }, cookie)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      )
    }
  }
)
