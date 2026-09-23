import { createAsyncThunk } from '@reduxjs/toolkit'
import { getLeaderboard, type LeaderboardRecord } from '../../api'

export const fetchLeaderboard = createAsyncThunk<
  LeaderboardRecord[],
  string | undefined,
  { rejectValue: string }
>('leaderboard/fetchAll', async (cookie, { rejectWithValue }) => {
  try {
    return await getLeaderboard({}, cookie)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    )
  }
})
