import dotenv from 'dotenv'
dotenv.config()

import { HelmetServerState } from 'react-helmet-async'
import express, {
  ErrorRequestHandler,
  Request as ExpressRequest,
} from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import fs from 'fs/promises'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import serialize from 'serialize-javascript'
import cookieParser from 'cookie-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 80
const clientPath = path.join(__dirname, '..')
const isDev = process.env.NODE_ENV === 'development'

// Отдаётся, когда упал сам рендер React,
// поэтому ни от React, ни от бандла стилей, ни от файлов на диске не зависит
const ERROR_HTML = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Что-то пошло не так | Таверна</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, sans-serif;
        background: #f5f3ee;
        color: #2b2a27;
        text-align: center;
      }
      main { padding: 24px; max-width: 440px; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0 0 24px; line-height: 1.5; }
      a { color: inherit; }
    </style>
  </head>
  <body>
    <main>
      <h1>Таверна временно закрыта</h1>
      <p>На сервере что-то сломалось. Мы уже знаем о проблеме и чиним её — попробуйте зайти чуть позже.</p>
      <a href="/">Вернуться на главную</a>
    </main>
  </body>
</html>`

async function createServer() {
  const app = express()

  app.use(cookieParser())
  let vite: ViteDevServer | undefined
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    })

    app.use(vite.middlewares)
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    )
  }

  app.get('/{*splat}', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string
        initialState: unknown
        helmet: HelmetServerState
        styleTags: string
      }>
      let template: string
      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template)

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).render
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        )

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.mjs'
        )

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render
      }

      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req)

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        )

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err)
    if (res.headersSent) {
      return next(err)
    }
    res.status(500).set({ 'Content-Type': 'text/html' }).end(ERROR_HTML)
  }

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
