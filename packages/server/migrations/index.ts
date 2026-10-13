import { QueryTypes } from 'sequelize'
import type { Sequelize } from 'sequelize'
import {
  MIGRATION_NAME,
  up as removeTopicReactions,
} from './002-remove-topic-reactions'

const migrations = [{ name: MIGRATION_NAME, up: removeTopicReactions }]

export async function runMigrations(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      name VARCHAR(255) NOT NULL PRIMARY KEY
    )
  `)

  const applied = await sequelize.query<{ name: string }>(
    'SELECT name FROM "SequelizeMeta"',
    { type: QueryTypes.SELECT }
  )
  const appliedNames = new Set(applied.map((row: { name: string }) => row.name))

  for (const migration of migrations) {
    if (appliedNames.has(migration.name)) continue

    await migration.up(sequelize)
    await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES ($1)', {
      bind: [migration.name],
    })
  }
}
