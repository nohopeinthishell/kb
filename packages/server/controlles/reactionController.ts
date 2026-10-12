import type { Request, Response } from 'express'
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize'
import type { AuthenticatedLocals } from '../middleware'
import { Comment, Reaction, REACTION_TYPES } from '../models'
import type { ReactionType } from '../models'
import { isPlainObject } from '../utils'

function isReactionType(value: unknown): value is ReactionType {
  return REACTION_TYPES.some(type => type === value)
}

export const createReaction = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const body: unknown = req.body
    if (!isPlainObject(body))
      return res.status(400).json({ reason: 'Ожидается JSON-объект' })

    const { commentId, type } = body
    if (
      typeof commentId !== 'number' ||
      !Number.isSafeInteger(commentId) ||
      commentId <= 0 ||
      commentId > 2147483647
    )
      return res.status(400).json({ reason: 'Некорректный ID комментария' })

    if (!isReactionType(type))
      return res.status(400).json({
        reason: `Допустимые реакции: ${REACTION_TYPES.join(', ')}`,
      })

    const comment = await Comment.findByPk(commentId)
    if (!comment)
      return res.status(404).json({ reason: 'Комментарий не найден' })

    const reaction = await Reaction.create({
      commentId,
      type,
      authorId: res.locals.user.id,
    })
    return res.status(201).json(reaction)
  } catch (e) {
    if (e instanceof UniqueConstraintError)
      return res.status(409).json({ reason: 'Реакция уже добавлена' })
    if (e instanceof ForeignKeyConstraintError)
      return res.status(404).json({ reason: 'Комментарий не найден' })
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось добавить реакцию' })
  }
}

export const deleteReaction = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const reactionId = Number(req.params.reactionId)
    if (!Number.isSafeInteger(reactionId) || reactionId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID реакции' })

    const reaction = await Reaction.findByPk(reactionId)
    if (!reaction) return res.status(404).json({ reason: 'Реакция не найдена' })
    if (reaction.authorId !== res.locals.user.id)
      return res.status(403).json({ reason: 'Нельзя удалить чужую реакцию' })

    await reaction.destroy()
    return res.status(204).send()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось удалить реакцию' })
  }
}
