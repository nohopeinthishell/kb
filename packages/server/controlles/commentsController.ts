import { isPlainObject } from '../utils'
import type { Response, Request } from 'express'
import { ForeignKeyConstraintError } from 'sequelize'
import type { AuthenticatedLocals } from '../middleware'
import { Comment, Reaction, Topic } from '../models'

export const getComments = async (req: Request, res: Response) => {
  if (
    req.query.limit !== undefined &&
    (typeof req.query.limit !== 'string' || !/^\d+$/.test(req.query.limit))
  )
    return res
      .status(400)
      .json({ reason: 'Параметр limit должен быть целым числом от 1 до 50' })

  if (
    req.query.offset !== undefined &&
    (typeof req.query.offset !== 'string' || !/^\d+$/.test(req.query.offset))
  )
    return res
      .status(400)
      .json({ reason: 'Параметр offset должен быть целым числом не меньше 0' })

  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit)
  const offset = req.query.offset === undefined ? 0 : Number(req.query.offset)

  if (!Number.isInteger(limit) || limit < 1 || limit > 50)
    return res
      .status(400)
      .json({ reason: 'Параметр limit должен быть целым числом от 1 до 50' })

  if (!Number.isSafeInteger(offset) || offset < 0)
    return res
      .status(400)
      .json({ reason: 'Параметр offset должен быть целым числом не меньше 0' })

  try {
    if (!(typeof req.query.topicId === 'string'))
      return res
        .status(400)
        .json({ reason: 'Параметр topicId должен быть строкой' })

    const topicId = Number(req.query.topicId)

    if (!Number.isInteger(topicId) || topicId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID топика' })

    const topic = await Topic.findByPk(topicId)

    if (!topic) return res.status(404).json({ reason: 'Топик не найден' })

    const comments = await Comment.findAll({
      where: { topicId, parentCommentId: null },
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [{ model: Reaction, as: 'reactions' }],
    })

    return res.status(200).json(comments)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось получить комментарии' })
  }
}

export const createComment = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const body: unknown = req.body

    const userId = res.locals.user.id

    if (!isPlainObject(body))
      return res.status(400).json({ reason: 'Ожидается JSON-объект' })

    const text = body.text
    if (!(typeof text === 'string'))
      return res.status(400).json({ reason: 'Комментарий должен быть строкой' })

    const textTrim = text.trim()

    if (!(textTrim.length > 0 && textTrim.length <= 5000))
      return res
        .status(400)
        .json({ reason: 'Комментарий должен содержать от 1 до 5000 символов' })

    const topicId = body.topicId

    if (typeof topicId !== 'number')
      return res.status(400).json({ reason: 'ID топика должен быть числом' })

    if (!Number.isInteger(topicId) || topicId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID топика' })

    const topic = await Topic.findByPk(topicId)

    if (!topic) return res.status(404).json({ reason: 'Топик не найден' })

    const parentCommentId = body.parentCommentId ?? null

    if (parentCommentId !== null) {
      if (
        typeof parentCommentId !== 'number' ||
        !Number.isInteger(parentCommentId) ||
        parentCommentId <= 0
      )
        return res
          .status(400)
          .json({ reason: 'Некорректный ID родительского комментария' })

      const parent = await Comment.findByPk(parentCommentId)
      if (!parent)
        return res
          .status(404)
          .json({ reason: 'Родительский комментарий не найден' })
      if (parent.topicId !== topicId)
        return res.status(400).json({
          reason: 'Родительский комментарий относится к другому топику',
        })
    }

    const comment = await Comment.create({
      text: textTrim,
      authorId: userId,
      topicId,
      parentCommentId,
    })

    return res.status(201).json(comment)
  } catch (e) {
    if (e instanceof ForeignKeyConstraintError)
      return res
        .status(404)
        .json({ reason: 'Топик или родительский комментарий не найден' })
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось создать комментарий' })
  }
}

export const deleteComment = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const commentId = Number(req.params.commentId)

    if (!Number.isInteger(commentId) || commentId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID комментария' })

    const comment = await Comment.findByPk(commentId)

    if (!comment)
      return res.status(404).json({ reason: 'Комментарий не найден' })

    const userId = res.locals.user.id

    if (comment.authorId !== userId)
      return res
        .status(403)
        .json({ reason: 'Нельзя удалить чужой комментарий' })

    await comment.destroy()

    return res.status(204).send()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось удалить комментарий' })
  }
}
