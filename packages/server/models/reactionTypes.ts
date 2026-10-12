export const REACTION_TYPES = ['like', 'heart', 'laugh'] as const
export type ReactionType = typeof REACTION_TYPES[number]

export function isReactionType(value: unknown): value is ReactionType {
  return REACTION_TYPES.some(type => type === value)
}
