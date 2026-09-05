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
  authCheckError: string | null
}

type CheckAuthRejectValue = {
  message: string
  statusCode?: number
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  authCheckError: null,
}

export const checkAuth = createAsyncThunk<
  User,
  void,
  { rejectValue: CheckAuthRejectValue }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.statusCode,
      })
    }

    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Не удалось проверить авторизацию',
    })
  }
})

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
      state.authCheckError = null
    },
    setUserError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    },
    clearUserError: state => {
      state.error = null
    },
    clearUser: state => {
      state.user = null
      state.isAuthChecked = true
      state.error = null
      state.authCheckError = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
        state.authCheckError = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        if (action.payload?.statusCode === 401) {
          state.user = null
          state.isAuthChecked = true
          state.authCheckError = null
          return
        }

        state.isAuthChecked = false
        state.authCheckError =
          action.payload?.message ??
          action.error.message ??
          'Не удалось проверить авторизацию'
      })
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthChecked = true
        state.isLoading = false
        state.authCheckError = null
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
        state.authCheckError = null
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
export const selectAuthCheckError = (state: RootState) =>
  state.user.authCheckError

export const { clearUser, clearUserError, setUser, setUserError } =
  userSlice.actions

export default userSlice.reducer
