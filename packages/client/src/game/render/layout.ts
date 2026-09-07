import type { DefaultTheme } from 'styled-components'

import type { GuestState, TableState } from '../core'
import type { SeatPosition, TableRect } from './types'

export const calculatePositionByIndex = (
  index: number,
  table: TableRect
): SeatPosition => {
  const isDown = index >= 2
  const chairIndex = index % 2
  const x = table.x + table.width * (chairIndex === 0 ? 0.3 : 0.7)
  const y = isDown ? table.height + table.y : table.y

  return { x, y }
}

export const getColorByTableCondition = (
  condition: TableState['condition'],
  theme: DefaultTheme
): string => {
  switch (condition) {
    case 'new':
      return theme.colors.game.tableReady

    case 'worn':
      return theme.colors.game.tableWorn

    case 'broken':
      return theme.colors.game.tableBrokenFill
  }
}

export const getColorByMood = (
  mood: GuestState['mood'],
  theme: DefaultTheme
): string => {
  switch (mood) {
    case 'happy':
      return theme.colors.game.guestHappy

    case 'neutral':
      return theme.colors.game.guestNeutral

    case 'unhappy':
      return theme.colors.game.guestUnhappy
  }
}

const positions = [
  { x: 0.32, y: 0.38 }, // top-left
  { x: 0.68, y: 0.38 }, // top-right
  { x: 0.32, y: 0.7 }, // bottom-left
  { x: 0.68, y: 0.7 }, // bottom-right
]

const TABLE_WIDTH = 200

const TABLE_HEIGHT = 150

export const calculateTableRects = (
  width: number,
  height: number,
  tables: TableState[]
): TableRect[] => {
  return tables.map(table => {
    const { x, y } = positions[table.id - 1]
    const xPos = width * x - TABLE_WIDTH / 2
    const yPos = height * y - TABLE_HEIGHT / 2

    return {
      tableId: table.id,
      x: xPos,
      y: yPos,
      width: TABLE_WIDTH,
      height: TABLE_HEIGHT,
    }
  })
}
