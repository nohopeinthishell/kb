import { useEffect, useState } from 'react'
import { loadSprites } from '../utils/utils'
import { SpritesType } from '../game/render/types'

export const useSprites = () => {
  const [sprites, setSprites] = useState<SpritesType | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    loadSprites()
      .then(sprites => {
        if (!cancelled) {
          setSprites(sprites)
        }
      })
      .catch(error => {
        if (!cancelled) {
          setError(error)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return {
    sprites,
    error,
    isLoading: !sprites && !error,
  }
}
