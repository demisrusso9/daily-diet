import { generateKey, randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { generateJwtAndRefreshToken } from '../auth'
import bcrypt from 'bcrypt'

import { z } from 'zod'
import { checkIfTokenExists } from '../middlewares/check-if-token-exists'

interface User {
  id: string
  email: string
  password: string
  created_at: string
  refresh_token: string
}

export async function createAccount(app: FastifyInstance) {
  app.post('/create', async (req, reply) => {
    const schema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string()
    })

    const { email, password } = schema.parse(req.body)

    const userAlreadyExists = await knex('users').where({ email }).first()

    if (userAlreadyExists) {
      return reply.status(200).send({ message: 'User already exists' })
    }

    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = {
      id: randomUUID(),
      email,
      password: hashedPassword
    }

    const { accessToken, refreshToken } = await generateJwtAndRefreshToken(user)

    await knex('users').insert({ ...user, refresh_token: refreshToken })

    return reply.status(201).send({ message: 'User created', accessToken })
  })

  app.post('/login', async (req, reply) => {
    const schema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string()
    })

    const { email, password } = schema.parse(req.body)

    const user = await knex('users').select().where({ email }).first()

    if (!user) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (correctPassword) {
      const { accessToken, refreshToken } = await generateJwtAndRefreshToken({
        id: user.id,
        email: user.email,
        password: user.password
      })

      await knex('users').update({ refresh_token: refreshToken }).where({ email })

      return reply.status(200).send({ message: 'Logged', accessToken })
    } else {
      return reply.status(401).send({ error: true, message: 'Wrong password' })
    }
  })

  app.get('/test', { preHandler: checkIfTokenExists }, (req, reply) => {
    const array = [
      { id: 1, name: 'Name 1' },
      { id: 2, name: 'Name 2' }
    ]

    return reply.status(200).send(array)
  })
}
