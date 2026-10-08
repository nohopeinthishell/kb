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
import { Comment } from './Comment'
import type { Optional } from 'sequelize'

export const REACTION_TYPES = ['like', 'heart', 'laugh'] as const
export type ReactionType = typeof REACTION_TYPES[number]

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

  @BelongsTo(() => Comment)
  declare comment: Comment
}
