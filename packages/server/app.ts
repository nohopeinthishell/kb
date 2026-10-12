import cors from 'cors'
import express from 'express'
import {
  authenticate,
  getAuthenticatedUser,
  courseApiProxy,
  CourseApiOptions,
} from './middleware'

export function createApp(
  fetchUser: typeof fetch = fetch,
  options: CourseApiOptions = {}
) {
  const app = express()
  // Preflight requests must complete before session validation.
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  )
  const verifySession = authenticate(fetchUser, options.apiUrl)
  // These bootstrap endpoints cannot require a session before login.
  const publicEndpoints = new Set([
    'POST /auth/signin',
    'POST /auth/signup',
    'POST /oauth/yandex',
    'GET /oauth/yandex/service-id',
  ])
  app.use('/api/v2', (req, res, next) => {
    if (
      req.headers.origin &&
      req.headers.origin !==
        (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    ) {
      res.status(403).json({ reason: 'Origin not allowed' })
      return
    }
    next()
  })
  app.get('/api/v2/auth/user', getAuthenticatedUser(fetchUser, options.apiUrl))
  app.use(
    '/api/v2',
    (req, res, next) => {
      if (publicEndpoints.has(`${req.method} ${req.path}`)) next()
      else verifySession(req, res, next)
    },
    courseApiProxy(options)
  )
  app.use(verifySession)

  app.get('/friends', (_, res) => {
    res.json([
      { name: 'Саша', secondName: 'Панов' },
      { name: 'Лёша', secondName: 'Садовников' },
      { name: 'Серёжа', secondName: 'Иванов' },
    ])
  })

  app.get('/user', (_, res) => {
    // Имя намеренно содержит "</script>" — проверка, что React (при рендере в DOM)
    // и serialize-javascript (при сериализации в window.APP_INITIAL_STATE) экранируют
    // значение и не дают преждевременно закрыть тег <script> на SSR-странице
    res.json({ name: '</script>Степа', secondName: 'Степанов' })
  })

  app.get('/', (_, res) => {
    res.json('👋 Howdy from the server :)')
  })

  return app
}
