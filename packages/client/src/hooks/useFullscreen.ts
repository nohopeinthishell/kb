import { RefObject, useCallback, useEffect, useState } from 'react'

export const useFullscreen = (ref: RefObject<HTMLElement>) => {
  const [isSupported, setIsSupported] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!document.fullscreenEnabled) {
      return
    }
    setIsSupported(true)
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === ref.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [ref])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.error(e))
    } else {
      ref.current?.requestFullscreen().catch(e => console.error(e))
    }
  }, [ref])

  return { isSupported, isFullscreen, toggle }
}
