import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { Topic } from './Topic'
import { Reaction } from './Reaction'
import type { Optional } from 'sequelize'

type CommentAttributes = {
  id: number
  text: string
  authorId: number
  topicId: number
  parentCommentId: number | null
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'parentCommentId'
>

@Table({
  tableName: 'comment',
  timestamps: true,
})
export class Comment extends Model<
  CommentAttributes,
  CommentCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare text: string

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @AllowNull(false)
  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  declare topicId: number

  @BelongsTo(() => Topic)
  declare topic: Topic

  @HasMany(() => Reaction)
  declare reactions: Reaction[]

  @AllowNull(true)
  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  declare parentCommentId: number | null

  @BelongsTo(() => Comment, {
    foreignKey: 'parentCommentId',
    onDelete: 'CASCADE',
  })
  declare parentComment: Comment | null

  @HasMany(() => Comment, 'parentCommentId')
  declare replies: Comment[]
}
