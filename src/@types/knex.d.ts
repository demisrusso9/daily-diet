import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      password: string
      created_at: string
      refresh_token: string
    }
    meals: {
      id: string
      name: string
      description: string
      healthy_diet: boolean
      created_at: Date
      user_id: string
    }
  }
}