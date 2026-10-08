import { isPlainObject } from '../utils'
import type { Response, Request } from 'express'
import type { AuthenticatedLocals } from '../middleware'
import { Topic } from '../models'

export const getTopics = async (_req: Request, res: Response) => {
  try {
    const topics = await Topic.findAll()

    return res.status(200).json(topics)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось получить топики' })
  }
}

export const createTopic = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const body: unknown = req.body

    const userId = res.locals.user.id

    if (!isPlainObject(body))
      return res.status(400).json({ reason: 'Ожидается JSON-объект' })

    const title = body.title
    if (!(typeof title === 'string'))
      return res.status(400).json({ reason: 'Название должно быть строкой' })

    const titleTrim = title.trim()

    if (!(titleTrim.length > 0 && titleTrim.length <= 200))
      return res
        .status(400)
        .json({ reason: 'Название должно содержать от 1 до 200 символов' })

    const topic = await Topic.create({ title: titleTrim, authorId: userId })

    return res.status(201).json(topic)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось создать топик' })
  }
}

export const getTopic = async (req: Request, res: Response) => {
  try {
    const topicId = Number(req.params.topicId)

    if (!Number.isInteger(topicId) || topicId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID топика' })

    const topic = await Topic.findByPk(topicId)

    if (!topic) return res.status(404).json({ reason: 'Топик не найден' })

    return res.status(200).json(topic)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось получить топик' })
  }
}

export const deleteTopic = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  try {
    const topicId = Number(req.params.topicId)

    if (!Number.isInteger(topicId) || topicId <= 0)
      return res.status(400).json({ reason: 'Некорректный ID топика' })

    const topic = await Topic.findByPk(topicId)

    if (!topic) return res.status(404).json({ reason: 'Топик не найден' })

    const userId = res.locals.user.id

    if (topic.authorId !== userId)
      return res.status(403).json({ reason: 'Нельзя удалить чужой топик' })

    await topic.destroy()

    return res.status(204).send()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reason: 'Не удалось удалить топик' })
  }
}
