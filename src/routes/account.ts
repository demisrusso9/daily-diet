import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.post('/create', async (req, res) => {
    const schema = z.object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string()
    })

    const body = schema.parse(req.body)

    const { email, password } = body
    const userAlreadyExists = await knex('users').where({ email }).first()

    if (userAlreadyExists) {
      return res.status(200).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      email,
      password
    })

    return res.status(201).send({ message: 'Created' })
  })
}
