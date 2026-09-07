import type { DefaultTheme } from 'styled-components'
import {
  calculatePositionByIndex,
  calculateTableRects,
  getColorByMood,
  getColorByTableCondition,
} from './layout'

import type { SeatPosition, TableRect, SpritesType } from './types'
import type { GameState, GuestState, TableState } from '../core'

export const drawTavern = (
  ctx: CanvasRenderingContext2D,
  theme: DefaultTheme,
  state: GameState,
  sprites: SpritesType,
  width = ctx.canvas.width,
  height = ctx.canvas.height
): void => {
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(sprites.background, 0, 0, width, height)

  const tableRects = calculateTableRects(width, height, state.tavern.tables)

  tableRects.forEach(table => {
    const tableState = state.tavern.tables.find(
      item => item.id === table.tableId
    )

    if (!tableState) return

    const guests = state.tavern.guests
      .filter(guest => guest.tableId === table.tableId)
      .slice(0, 4)

    ctx.save()
    ctx.fillStyle = getColorByTableCondition(tableState.condition, theme)
    ctx.strokeStyle = theme.colors.game.canvasLine
    ctx.lineWidth = 3

    drawChairs(ctx, table, 0, 2, sprites, theme)

    guests.slice(0, 2).forEach((guest, index) => {
      const position = calculatePositionByIndex(index, table)

      drawGuest(ctx, position, guest, sprites, theme)
    })

    drawTable(ctx, table, tableState, sprites, theme)

    ctx.lineWidth = 3
    drawChairs(ctx, table, 2, 4, sprites, theme)

    guests.slice(2, 4).forEach((guest, index) => {
      const position = calculatePositionByIndex(index + 2, table)

      drawGuest(ctx, position, guest, sprites, theme)
    })

    ctx.restore()
  })

  drawWaitress(ctx, sprites, theme, height)

  if (state.tavern.helperActive) {
    drawHelper(ctx, sprites, theme, height, width)
  }

  if (state.provisionWeeks > 0) {
    drawProvisions(ctx, sprites, theme, width, height)
  }
}

const drawTable = (
  ctx: CanvasRenderingContext2D,
  table: TableRect,
  tableState: TableState,
  sprites: SpritesType,
  theme: DefaultTheme
): void => {
  ctx.save()
  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7

  ctx.beginPath()

  const sprite = sprites.tables[tableState.condition]

  ctx.drawImage(sprite, table.x, table.y, table.width, table.height)

  ctx.restore()
}

const drawWaitress = (
  ctx: CanvasRenderingContext2D,
  sprites: SpritesType,
  theme: DefaultTheme,
  canvasHeight: number
): void => {
  ctx.save()

  const sprite = sprites.waitress

  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7

  const width = 150
  const height = width * (sprite.naturalHeight / sprite.naturalWidth)

  const x = 50
  const y = canvasHeight / 2 - height / 2

  ctx.drawImage(sprite, x, y, width, height)

  ctx.restore()
}

const drawHelper = (
  ctx: CanvasRenderingContext2D,
  sprites: SpritesType,
  theme: DefaultTheme,
  canvasHeight: number,
  canvasWidth: number
): void => {
  ctx.save()

  const sprite = sprites.helper

  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7

  const width = 100
  const height = width * (sprite.naturalHeight / sprite.naturalWidth)

  const x = canvasWidth - width - 50
  const y = canvasHeight / 2 - height / 2

  ctx.drawImage(sprite, x, y, width, height)

  ctx.restore()
}

const drawProvisions = (
  ctx: CanvasRenderingContext2D,
  sprites: SpritesType,
  theme: DefaultTheme,
  canvasWidth: number,
  canvasHeight: number
): void => {
  ctx.save()

  const sprite = sprites.provisions

  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7

  const width = 160
  const height = width * (sprite.naturalHeight / sprite.naturalWidth)
  const x = canvasWidth / 2 - width / 2
  const y = canvasHeight - height - 30

  ctx.drawImage(sprite, x, y, width, height)

  ctx.restore()
}

const drawChairs = (
  ctx: CanvasRenderingContext2D,
  table: TableRect,
  fromIndex: number,
  toIndex: number,
  sprites: SpritesType,
  theme: DefaultTheme
): void => {
  ctx.save()

  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7
  for (let index = fromIndex; index < toIndex; index++) {
    drawChair(ctx, calculatePositionByIndex(index, table), sprites)
  }

  ctx.restore()
}

const drawChair = (
  ctx: CanvasRenderingContext2D,
  position: SeatPosition,
  sprites: SpritesType
): void => {
  const sprite = sprites.stool
  const width = 100
  const height = width * (sprite.naturalHeight / sprite.naturalWidth)
  const x = position.x - width / 2
  const y = position.y - height / 2

  ctx.drawImage(sprite, x, y, width, height)
}

const drawGuest = (
  ctx: CanvasRenderingContext2D,
  position: SeatPosition,
  guest: GuestState,
  sprites: SpritesType,
  theme: DefaultTheme
): void => {
  ctx.save()
  ctx.shadowColor = getColorByMood(guest.mood, theme)
  ctx.shadowBlur = 8
  const sprite = sprites.guests[guest.mood]
  const height = 150
  const width = height * (sprite.naturalWidth / sprite.naturalHeight)
  const x = position.x - width / 2
  const y = position.y - height / 2

  ctx.drawImage(sprite, x, y, width, height)

  ctx.restore()
}
