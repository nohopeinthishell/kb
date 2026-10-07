import dotenv from 'dotenv'
dotenv.config()

import { createApp } from './app'
import { createClientAndConnect } from './db'

const app = createApp()
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
