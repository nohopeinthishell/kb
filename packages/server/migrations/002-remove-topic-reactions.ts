import type { Sequelize } from 'sequelize'

export const MIGRATION_NAME = '002-remove-topic-reactions'

export async function up(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`
    DROP INDEX IF EXISTS reaction_topic_author_type_unique
  `)

  await sequelize.query(`
    ALTER TABLE reaction
      DROP CONSTRAINT IF EXISTS reaction_exactly_one_target
  `)

  await sequelize.query(`
    ALTER TABLE reaction
      DROP CONSTRAINT IF EXISTS "reaction_topicId_fkey"
  `)

  await sequelize.query(`
    DELETE FROM reaction
    WHERE "commentId" IS NULL
  `)

  await sequelize.query(`
    ALTER TABLE reaction
      DROP COLUMN IF EXISTS "topicId"
  `)

  await sequelize.query(`
    ALTER TABLE reaction
      ALTER COLUMN "commentId" SET NOT NULL
  `)

  await sequelize.query(`
    DROP INDEX IF EXISTS reaction_comment_author_type_unique
  `)

  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "reaction_commentId_authorId_type"
      ON reaction ("commentId", "authorId", type)
  `)
}
