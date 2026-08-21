import { useEffect, useRef } from 'react'
import { drawTavern } from '../render'
import styled, { useTheme } from 'styled-components'
import type { GameState } from '../core'

type TavernCanvasProps = {
  state: GameState
}

const TavernCanvas = ({ state }: TavernCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) return

    drawTavern(context, theme, state)
  }, [theme, state])

  return <Canvas ref={canvasRef} width={1000} height={800} />
}

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  background: ${({ theme }) => theme.colors.background.surface};
`

export default TavernCanvas
