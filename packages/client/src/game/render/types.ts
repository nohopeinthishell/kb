import { GuestState, TableState } from '../core'

export type TableRect = {
  tableId: number
  x: number
  y: number
  width: number
  height: number
}

export type SeatPosition = {
  x: number
  y: number
}

export type SpritesType = {
  background: HTMLImageElement
  guests: Record<GuestState['mood'], HTMLImageElement>
  tables: Record<TableState['condition'], HTMLImageElement>
  stool: HTMLImageElement
  waitress: HTMLImageElement
  helper: HTMLImageElement
  provisions: HTMLImageElement
}
