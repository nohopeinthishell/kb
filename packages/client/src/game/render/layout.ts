import type { DefaultTheme } from 'styled-components'

import type { GuestState, TableState } from '../core'
import type { SeatPosition, TableRect } from './types'

export const TABLE_RECTS = [
  { tableId: 1, x: 50, y: 70, width: 200, height: 150 },
  { tableId: 2, x: 440, y: 70, width: 200, height: 150 },
  { tableId: 3, x: 50, y: 460, width: 200, height: 150 },
  { tableId: 4, x: 440, y: 460, width: 200, height: 150 },
]

export const calculatePositionByIndex = (
  index: number,
  table: TableRect
): SeatPosition => {
  const isDown = index >= 2
  const chairIndex = index % 2
  const x = table.x + table.width * (chairIndex === 0 ? 0.3 : 0.7)
  const y = isDown ? table.height + table.y + 30 : table.y - 30

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
