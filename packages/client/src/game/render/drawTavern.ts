import type { DefaultTheme } from 'styled-components'
import {
  calculatePositionByIndex,
  calculateTableRects,
  getColorByMood,
  getColorByTableCondition,
} from './layout'

import type { SeatPosition, TableRect } from './types'
import type { GameState, GuestState, TableState } from '../core'

export const drawTavern = (
  ctx: CanvasRenderingContext2D,
  theme: DefaultTheme,
  state: GameState,
  width = ctx.canvas.width,
  height = ctx.canvas.height
): void => {
  ctx.clearRect(0, 0, width, height)
  const tableRects = calculateTableRects(width, height, state.tavern.tables)

  ctx.save()

  ctx.strokeStyle = theme.colors.game.canvasLine
  ctx.lineWidth = 4

  ctx.shadowColor = theme.colors.background.overlay
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 7

  tableRects.forEach(table => drawTable(ctx, table, state.tavern.tables, theme))

  ctx.restore()

  ctx.save()

  ctx.lineWidth = 2
  ctx.strokeStyle = theme.colors.game.canvasLine

  tableRects.forEach(table => drawTableBoards(ctx, table))

  ctx.restore()

  ctx.save()
  ctx.lineWidth = 3
  ctx.strokeStyle = theme.colors.game.canvasLine

  tableRects.forEach(table => {
    const guests = state.tavern.guests
      .filter(guest => guest.tableId === table.tableId)
      .slice(0, 4)

    guests.forEach((guest, index) => {
      const position = calculatePositionByIndex(index, table)
      drawGuest(ctx, position, guest, theme)
    })
  })

  ctx.restore()
}

const drawTable = (
  ctx: CanvasRenderingContext2D,
  table: TableRect,
  tables: TableState[],
  theme: DefaultTheme
): void => {
  const tableState = tables.find(item => item.id === table.tableId)

  if (!tableState) return

  ctx.fillStyle = getColorByTableCondition(tableState.condition, theme)

  ctx.beginPath()
  ctx.roundRect(table.x, table.y, table.width, table.height, 15)
  ctx.fill()
  ctx.stroke()

  for (let i = 0; i < 4; i++) {
    const position = calculatePositionByIndex(i, table)
    drawChair(ctx, position)
  }
}

const drawTableBoards = (
  ctx: CanvasRenderingContext2D,
  table: TableRect
): void => {
  ctx.beginPath()
  const firstLine = table.y + (1 / 3) * table.height
  const secondLine = table.y + (2 / 3) * table.height

  ctx.moveTo(table.x + 12, firstLine)
  ctx.lineTo(table.x + table.width - 12, firstLine)

  ctx.moveTo(table.x + 12, secondLine)
  ctx.lineTo(table.x + table.width - 12, secondLine)
  ctx.stroke()
}

const drawChair = (
  ctx: CanvasRenderingContext2D,
  position: SeatPosition
): void => {
  ctx.beginPath()
  ctx.arc(position.x, position.y, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
}

const drawGuest = (
  ctx: CanvasRenderingContext2D,
  position: SeatPosition,
  guest: GuestState,
  theme: DefaultTheme
): void => {
  ctx.fillStyle = getColorByMood(guest.mood, theme)

  ctx.beginPath()
  ctx.arc(position.x, position.y, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
}
