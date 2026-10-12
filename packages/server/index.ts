import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

import { createApp } from './app'
import { createClientAndConnect } from './db'
import { forumRouter } from './routes'

const app = createApp()
const port = Number(process.env.SERVER_PORT) || 3001

app.use(express.json())

app.use('/forum', forumRouter)

const startServer = async (): Promise<void> => {
  try {
    await createClientAndConnect()
    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

startServer()
