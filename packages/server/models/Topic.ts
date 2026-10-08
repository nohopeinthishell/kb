import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { Comment } from './Comment'
import type { Optional } from 'sequelize'

type TopicAttributes = {
  id: number
  title: string
  authorId: number
}

type TopicCreationAttributes = Optional<TopicAttributes, 'id'>

@Table({
  tableName: 'topic',
  timestamps: true,
})
export class Topic extends Model<TopicAttributes, TopicCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare title: string

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @HasMany(() => Comment)
  declare comments: Comment[]
}
