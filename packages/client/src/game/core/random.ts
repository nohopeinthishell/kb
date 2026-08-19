import { RandomResult } from './types'

const MULTIPLIER = 1664525
const INCREMENT = 1013904223
const UINT32_SIZE = 4294967296

export const nextRandom = (seed: number): RandomResult => {
  const normalizedSeed = seed >>> 0

  const nextSeed = (Math.imul(normalizedSeed, MULTIPLIER) + INCREMENT) >>> 0

  return {
    value: nextSeed / UINT32_SIZE,
    nextSeed,
  }
}
