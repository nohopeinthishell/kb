import { useEffect, useRef, useState } from 'react'
import { drawTavern } from '../render'
import { useTheme } from 'styled-components'
import { initialGameState } from '../core'

const TavernCanvas = () => {
  const [state, setState] = useState(initialGameState)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) return

    drawTavern(context, theme, state)
  }, [theme, state])

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={800}
      style={{ background: '#FFF' }}
    />
  )
}

export default TavernCanvas
