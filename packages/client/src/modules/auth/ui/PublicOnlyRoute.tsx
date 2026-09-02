import { useEffect, useState, type PropsWithChildren } from 'react'

import { Navigate } from 'react-router-dom'

import { ROUTES } from '../../../constants/routes'
import { useAuth } from '../../../hooks/useAuth'

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { isAuthChecked, isAuthenticated } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isAuthChecked) {
    return null
  }

  if (isAuthenticated) {
    return isClient ? <Navigate to={ROUTES.main} replace /> : null
  }

  return <>{children}</>
}
