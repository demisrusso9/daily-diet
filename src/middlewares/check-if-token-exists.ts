import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'
import { FORBIDDEN, UNAUTHORIZED } from '../utils/statusCode'

export async function checkIfTokenExists(req: FastifyRequest, reply: FastifyReply) {
  const { authorization } = req.headers
  const token = authorization?.split(' ')[1]

  if (!token) {
    return reply
      .code(UNAUTHORIZED)
      .send({ error: true, message: 'Access token not provided' })
  }

  try {
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken
  } catch (error) {
    req.user = null
    return reply.code(FORBIDDEN).send({ error: true, message: 'Invalid token' })
  }
}
