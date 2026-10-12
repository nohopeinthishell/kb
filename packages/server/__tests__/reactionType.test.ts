import { isReactionType, REACTION_TYPES } from '../models/reactionTypes'

describe('isReactionType', () => {
  test.each([...REACTION_TYPES])('принимает %s', type => {
    expect(isReactionType(type)).toBe(true)
  })

  test.each(['👍', 'like ', 'LIKE', '', 1, null, undefined, { type: 'like' }])(
    'отклоняет %p',
    value => {
      expect(isReactionType(value)).toBe(false)
    }
  )
})
