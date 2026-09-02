import { useEffect } from 'react'

import { checkAuth, selectIsAuthChecked, selectUser } from '../slices/userSlice'
import { useDispatch, useSelector } from '../store'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthChecked = useSelector(selectIsAuthChecked)

  useEffect(() => {
    if (!isAuthChecked) {
      void dispatch(checkAuth())
    }
  }, [dispatch, isAuthChecked])

  return {
    user,
    isAuthChecked,
    isAuthenticated: Boolean(user),
  }
}
