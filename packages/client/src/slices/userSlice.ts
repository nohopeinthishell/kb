import type { RootState } from '../store'

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ApiError,
  getCurrentUser,
  signIn,
  signUp,
  type SignInRequest,
  type SignUpRequest,
  type User,
} from '../api'

type UserState = {
  user: User | null
  isAuthChecked: boolean
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
}

export const checkAuth = createAsyncThunk('user/checkAuth', getCurrentUser)

export const login = createAsyncThunk(
  'user/login',
  async (credentials: SignInRequest) => {
    try {
      await signIn(credentials)
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.message === 'User already in system'
      ) {
        return getCurrentUser()
      }

      throw error
    }

    return getCurrentUser()
  }
)

export const register = createAsyncThunk(
  'user/register',
  async (data: SignUpRequest) => {
    await signUp(data)
    return getCurrentUser()
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
      state.isAuthChecked = true
      state.error = null
    },
    setUserError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    },
    clearUser: state => {
      state.user = null
      state.isAuthChecked = true
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
      })
      .addCase(checkAuth.rejected, state => {
        state.user = null
        state.isAuthChecked = true
      })
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
        state.isLoading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Не удалось войти'
      })
      .addCase(register.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Не удалось зарегистрироваться'
      })
  },
})

export const selectUser = (state: RootState) => state.user.user
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked
export const selectAuthLoading = (state: RootState) => state.user.isLoading
export const selectUserError = (state: RootState) => state.user.error

export const { clearUser, setUser, setUserError } = userSlice.actions

export default userSlice.reducer
