import { useEffect, useRef } from 'react'
import { drawTavern } from '../render'
import styled, { useTheme } from 'styled-components'
import type { GameState } from '../core'

type TavernCanvasProps = {
  state: GameState
}

const LOGICAL_WIDTH = 1000
const LOGICAL_HEIGHT = 800

const TavernCanvas = ({ state }: TavernCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const pixelRatio = window.devicePixelRatio || 1
      const pixelWidth = Math.max(1, Math.round(width * pixelRatio))
      const pixelHeight = Math.max(1, Math.round(height * pixelRatio))

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }

      const context = canvas.getContext('2d')
      if (!context) return

      context.setTransform(
        (width / LOGICAL_WIDTH) * pixelRatio,
        0,
        0,
        (height / LOGICAL_HEIGHT) * pixelRatio,
        0,
        0
      )

      drawTavern(context, theme, state, LOGICAL_WIDTH, LOGICAL_HEIGHT)
    }

    draw()

    const resizeObserver = new ResizeObserver(draw)
    resizeObserver.observe(canvas)

    return () => resizeObserver.disconnect()
  }, [theme, state])

  return (
    <Canvas ref={canvasRef} width={LOGICAL_WIDTH} height={LOGICAL_HEIGHT} />
  )
}

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  background: ${({ theme }) => theme.colors.background.surface};
`

export default TavernCanvas
