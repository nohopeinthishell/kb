import { REPUTATION_SCORE_MULTIPLIER } from './constants'

export const calculateScore = (money: number, reputation: number): number =>
  money + reputation * REPUTATION_SCORE_MULTIPLIER
