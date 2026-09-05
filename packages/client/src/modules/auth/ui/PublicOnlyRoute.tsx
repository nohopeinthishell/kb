import { useEffect, useState, type PropsWithChildren } from 'react'

import { Navigate } from 'react-router-dom'

import { ROUTES } from '../../../constants/routes'
import { useAuth } from '../../../hooks/useAuth'
import { AuthCheckFailure } from './AuthCheckFailure'

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { authCheckError, isAuthChecked, isAuthenticated, retryAuthCheck } =
    useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (authCheckError) {
    return <AuthCheckFailure onRetry={retryAuthCheck} />
  }

  if (!isAuthChecked) {
    return null
  }

  if (isAuthenticated) {
    return isClient ? <Navigate to={ROUTES.main} replace /> : null
  }

  return <>{children}</>
}
