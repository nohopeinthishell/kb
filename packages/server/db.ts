import { Comment, Reaction, Topic } from './models'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

const sequelizeOptions: SequelizeOptions = {
  host: POSTGRES_HOST || 'localhost',
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
  models: [Topic, Comment, Reaction],
}

export const sequelize = new Sequelize(sequelizeOptions)

export const createClientAndConnect = async (): Promise<void> => {
  await sequelize.authenticate()
  console.log('Successful connection')

  await sequelize.sync()
  console.log('Tables prepared')
}
