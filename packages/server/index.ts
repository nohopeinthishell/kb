import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

import { createApp } from './app'
import { createClientAndConnect } from './db'

const app = createApp()
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
