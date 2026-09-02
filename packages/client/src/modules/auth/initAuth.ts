import type { PageInitArgs } from '../../routes'

import { getCurrentUser } from '../../api'
import { clearUser, selectIsAuthChecked, setUser } from '../../slices/userSlice'

export const initAuth = async ({ dispatch, state, ctx }: PageInitArgs) => {
  if (selectIsAuthChecked(state)) return

  try {
    dispatch(setUser(await getCurrentUser(ctx.cookie)))
  } catch {
    dispatch(clearUser())
  }
}
