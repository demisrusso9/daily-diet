import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import jwt, { decode } from 'jsonwebtoken'
import { knex } from '../database'
import { generateJwtAndRefreshToken } from '../auth'
import { env } from '../env'
import { checkTokenExpiration } from '../middlewares/check-token-expiration'
import { CONFLICT, CREATED, NOT_FOUND, UNAUTHORIZED, OK, FORBIDDEN } from '../utils/statusCode'

export async function accountRoutes(app: FastifyInstance) {
  app.post('/create', async (req, reply) => {
    const schema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string()
    })

    const { email, password } = schema.parse(req.body)

    const userAlreadyExists = await knex('users').where({ email }).first()

    if (userAlreadyExists) {
      return reply.code(CONFLICT).send({ message: 'User already exists' })
    }

    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = {
      id: randomUUID(),
      email,
      password: hashedPassword
    }

    const { accessToken, refreshToken } = await generateJwtAndRefreshToken({
      id: user.id,
      email: user.email
    })

    await knex('users').insert({ ...user, refresh_token: refreshToken })

    return reply.code(CREATED).send({ message: 'User created', accessToken, refreshToken })
  })

  app.post('/login', async (req, reply) => {
    const schema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string()
    })

    const { email, password } = schema.parse(req.body)

    const user = await knex('users').select().where({ email }).first()

    if (!user) {
      return reply.code(NOT_FOUND).send({ message: 'User not found' })
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
      return reply.code(UNAUTHORIZED).send({ message: 'Wrong password' })
    }

    const { accessToken, refreshToken } = await generateJwtAndRefreshToken({
      id: user.id,
      email: user.email
    })

    await knex('users').update({ refresh_token: refreshToken }).where({ email })

    req.user = decode(accessToken)
    return reply.code(OK).send({ message: 'Logged', accessToken, refreshToken })
  })

  app.post('/refresh-token', { preHandler: checkTokenExpiration }, async (req, reply) => {
    const schema = z.object({
      refreshToken: z.string()
    })

    const { refreshToken } = schema.parse(req.body)

    if (!refreshToken) {
      return reply.code(UNAUTHORIZED).send({ message: 'Refresh token not provided' })
    }

    try {
      const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload

      const database = await knex('users')
        .select('refresh_token')
        .where({ id: decodedToken.id })
        .first()

      if (database?.refresh_token !== refreshToken) {
        throw new Error('Refresh token mismatch')
      }

      const { accessToken, refreshToken: newRefreshToken } = await generateJwtAndRefreshToken({
        id: decodedToken.id,
        email: decodedToken.email
      })

      await knex('users').update({ refresh_token: newRefreshToken }).where({ id: decodedToken.id })

      return reply.code(OK).send({ accessToken, refreshToken: newRefreshToken })
    } catch (error) {
      return reply.code(FORBIDDEN).send({ message: 'Invalid refresh token' })
    }
  })
}
