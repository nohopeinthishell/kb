import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { User } from '../api'
import type { RootState } from '../store'

type ProfileState = {
  user: User | null
  error: string | null
}

const initialState: ProfileState = {
  user: null,
  error: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
      state.error = null
    },
    setProfileError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    },
    clearProfile: state => {
      state.user = null
      state.error = null
    },
  },
})

export const selectProfile = (state: RootState) => state.profile.user
export const selectProfileError = (state: RootState) => state.profile.error
export const { clearProfile, setProfile, setProfileError } =
  profileSlice.actions
export default profileSlice.reducer
