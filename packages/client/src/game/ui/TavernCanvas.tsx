import { useEffect, useRef, useState } from 'react'
import { drawTavern } from '../render'
import styled, { useTheme } from 'styled-components'
import type { GameState } from '../core'

type TavernCanvasProps = {
  state: GameState
}

import { useSprites } from '../../hooks/useSprites'

const LOGICAL_WIDTH = 1000
const LOGICAL_HEIGHT = 800

const TavernCanvas = ({ state }: TavernCanvasProps) => {
  const { sprites, error, isLoading } = useSprites()
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

      if (!sprites) return

      const scale = Math.min(width / LOGICAL_WIDTH, height / LOGICAL_HEIGHT)
      const offsetX = (width - LOGICAL_WIDTH * scale) / 2
      const offsetY = (height - LOGICAL_HEIGHT * scale) / 2

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.setTransform(
        scale * pixelRatio,
        0,
        0,
        scale * pixelRatio,
        offsetX * pixelRatio,
        offsetY * pixelRatio
      )

      drawTavern(context, theme, state, sprites, LOGICAL_WIDTH, LOGICAL_HEIGHT)
    }

    draw()

    const resizeObserver = new ResizeObserver(draw)
    resizeObserver.observe(canvas)

    return () => resizeObserver.disconnect()
  }, [theme, state, sprites])

  return (
    <Canvas ref={canvasRef} width={LOGICAL_WIDTH} height={LOGICAL_HEIGHT} />
  )
}

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.background.surface};
`

export default TavernCanvas
