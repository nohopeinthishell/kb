import { Comment, Topic } from '../types'

// Логин появится из авторизации; пока подставляем один и тот же.
const CURRENT_USER_LOGIN = 'tavern_keeper'

const topics: Topic[] = [
  {
    id: 1,
    title: 'Как продержаться после пожара на третьей неделе?',
    authorLogin: 'grumpy_bard',
    createdAt: '2026-08-20T10:15:00.000Z',
    comments: [
      {
        id: 101,
        topicId: 1,
        authorLogin: 'ale_master',
        text: 'Не чини всё сразу. Один стол в неделю — и хватит золота на провизию.',
        createdAt: '2026-08-20T11:02:00.000Z',
      },
      {
        id: 102,
        topicId: 1,
        authorLogin: 'grumpy_bard',
        text: 'Пробовал, репутация просела до нуля к пятой неделе.',
        createdAt: '2026-08-20T12:40:00.000Z',
      },
    ],
  },
  {
    id: 2,
    title:
      'Помощник или провизия: что брать первым, если золота хватает только на одно',
    authorLogin: 'ale_master',
    createdAt: '2026-08-21T08:00:00.000Z',
    comments: [
      {
        id: 103,
        topicId: 2,
        authorLogin: 'silent_cook',
        text: 'Провизию. Помощник без еды всё равно простаивает.',
        createdAt: '2026-08-21T09:30:00.000Z',
      },
    ],
  },
  {
    id: 3,
    title: 'Баг или фича: гости уходят при полной таверне',
    authorLogin: 'silent_cook',
    createdAt: '2026-08-22T14:20:00.000Z',
    comments: [],
  },
  {
    id: 4,
    title: 'Рекорд: 1420 очков за шесть недель',
    authorLogin: 'coin_counter',
    createdAt: '2026-08-25T19:05:00.000Z',
    comments: [
      {
        id: 104,
        topicId: 4,
        authorLogin: 'grumpy_bard',
        text: 'Покажи расклад по неделям, не верю.',
        createdAt: '2026-08-25T20:11:00.000Z',
      },
    ],
  },
  {
    id: 5,
    title: 'Тёмная тема глаза не режет?',
    authorLogin: 'night_owl',
    createdAt: '2026-08-28T22:45:00.000Z',
    comments: [],
  },
]

let nextTopicId = 6
let nextCommentId = 105

export const fetchTopics = (): Promise<Topic[]> => Promise.resolve(topics)

export const fetchTopic = (id: number): Promise<Topic | null> => {
  const stored = topics.find(topic => topic.id === id)

  return Promise.resolve(stored ?? null)
}

export const createTopic = (title: string): Promise<Topic> => {
  const stored: Topic = {
    id: nextTopicId++,
    title,
    authorLogin: CURRENT_USER_LOGIN,
    createdAt: new Date().toISOString(),
    comments: [],
  }

  topics.unshift(stored)

  return Promise.resolve(stored)
}

export const createComment = (
  topicId: number,
  text: string
): Promise<Comment> => {
  const stored = topics.find(topic => topic.id === topicId)

  if (!stored) {
    return Promise.reject(new Error('Топик не найден'))
  }

  const comment: Comment = {
    id: nextCommentId++,
    topicId,
    authorLogin: CURRENT_USER_LOGIN,
    text,
    createdAt: new Date().toISOString(),
  }

  stored.comments.push(comment)

  return Promise.resolve(comment)
}
