import { useEffect } from 'react'

import {
  checkAuth,
  selectAuthCheckError,
  selectIsAuthChecked,
  selectUser,
} from '../slices/userSlice'
import { useDispatch, useSelector } from '../store'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthChecked = useSelector(selectIsAuthChecked)
  const authCheckError = useSelector(selectAuthCheckError)

  useEffect(() => {
    if (!isAuthChecked && !authCheckError) {
      void dispatch(checkAuth())
    }
  }, [authCheckError, dispatch, isAuthChecked])

  return {
    user,
    isAuthChecked,
    authCheckError,
    isAuthenticated: Boolean(user),
    retryAuthCheck: () => void dispatch(checkAuth()),
  }
}
