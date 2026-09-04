import { useEffect, useRef, useState } from 'react'
import { drawTavern } from '../render'
import styled, { useTheme } from 'styled-components'
import type { GameState } from '../core'

type TavernCanvasProps = {
  state: GameState
}

import guestHappyImage from '../../assets/game/sprites/guest-happy.png'
import guestUnhappyImage from '../../assets/game/sprites/guest-unhappy.png'
import guestNeutralImage from '../../assets/game/sprites/guest-neutral.png'

import tableNewImage from '../../assets/game/sprites/table-new.png'
import tableWornImage from '../../assets/game/sprites/table-worn.png'
import tableBrokenImage from '../../assets/game/sprites/table-broken.png'
import stoolImage from '../../assets/game/sprites/stool.png'
import tavernBackgroundImage from '../../assets/game/sprites/tavern-background.png'
import waitressImage from '../../assets/game/sprites/waitress.png'
import helperImage from '../../assets/game/sprites/helper.png'
import provisionsImage from '../../assets/game/sprites/provisions.png'

import { SpritesType } from '../render/types'

const LOGICAL_WIDTH = 1000
const LOGICAL_HEIGHT = 800

const TavernCanvas = ({ state }: TavernCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  const [sprites, setSprites] = useState<SpritesType | null>()

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

  useEffect(() => {
    const guestHappy = new Image()
    const guestUnhappy = new Image()
    const guestNeutral = new Image()

    const tableNew = new Image()
    const tableWorn = new Image()
    const tableBroken = new Image()
    const stool = new Image()
    const background = new Image()
    const waitress = new Image()
    const helper = new Image()
    const provisions = new Image()

    const images = [
      guestHappy,
      guestUnhappy,
      guestNeutral,
      tableNew,
      tableWorn,
      tableBroken,
      stool,
      background,
      waitress,
      helper,
      provisions,
    ]

    let loadedCount = 0

    const handleLoad = () => {
      loadedCount++

      if (loadedCount === images.length) {
        setSprites({
          background,
          guests: {
            happy: guestHappy,
            unhappy: guestUnhappy,
            neutral: guestNeutral,
          },
          tables: {
            new: tableNew,
            worn: tableWorn,
            broken: tableBroken,
          },
          stool,
          waitress,
          helper,
          provisions,
        })
      }
    }

    images.forEach(image => {
      image.onload = handleLoad
    })

    tableNew.src = tableNewImage
    tableWorn.src = tableWornImage
    tableBroken.src = tableBrokenImage
    stool.src = stoolImage
    background.src = tavernBackgroundImage

    guestHappy.src = guestHappyImage
    guestUnhappy.src = guestUnhappyImage
    guestNeutral.src = guestNeutralImage

    waitress.src = waitressImage
    helper.src = helperImage
    provisions.src = provisionsImage

    return () => {
      images.forEach(image => {
        image.onload = null
      })
    }
  }, [])

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
