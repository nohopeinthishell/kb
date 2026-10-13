import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import type { Optional } from 'sequelize'
import { Comment } from './Comment'
import { REACTION_TYPES } from './reactionTypes'
import type { ReactionType } from './reactionTypes'

type ReactionAttributes = {
  id: number
  type: ReactionType
  authorId: number
  commentId: number
}

type ReactionCreationAttributes = Optional<ReactionAttributes, 'id'>

@Table({
  tableName: 'reaction',
  timestamps: true,
  indexes: [{ unique: true, fields: ['commentId', 'authorId', 'type'] }],
})
export class Reaction extends Model<
  ReactionAttributes,
  ReactionCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: { isIn: [[...REACTION_TYPES]] },
  })
  declare type: ReactionType

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @AllowNull(false)
  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  declare commentId: number

  @BelongsTo(() => Comment, { onDelete: 'CASCADE' })
  declare comment: Comment
}
