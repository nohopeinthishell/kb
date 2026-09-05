import type { PageInitArgs } from '../../routes'

import { ApiError, getCurrentUser } from '../../api'
import { clearUser, selectIsAuthChecked, setUser } from '../../slices/userSlice'

export const initAuth = async ({ dispatch, state, ctx }: PageInitArgs) => {
  if (selectIsAuthChecked(state)) return

  try {
    dispatch(setUser(await getCurrentUser(ctx.cookie)))
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      // Cookie API на другом домене могут быть доступны только браузеру.
      // После SSR 401 оставляем проверку незавершённой для useAuth.
      if (typeof window !== 'undefined') {
        dispatch(clearUser())
      }
      return
    }

    throw error
  }
}
