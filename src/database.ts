import { knex as setupKnex } from 'knex'
import { env } from './env'

export const config = {
  client: 'sqlite3',
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL
        }
      : env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  },
  useNullAsDefault: true
}

export const knex = setupKnex(config)
