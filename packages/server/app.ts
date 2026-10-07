import cors from 'cors'
import express from 'express'
import { authenticate } from './middleware'

export function createApp(fetchUser: typeof fetch = fetch) {
  const app = express()
  // Preflight requests must complete before session validation.
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  )
  app.use(authenticate(fetchUser))

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
