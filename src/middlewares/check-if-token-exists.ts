import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export async function checkIfTokenExists(req: FastifyRequest, reply: FastifyReply) {
  const { authorization } = req.headers

  const token = authorization?.split(' ')[1]

  if (!token) {
    return reply.status(401).send({ error: true, message: 'Not authorized' })
  }

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      return reply.status(403).send({ error: true, message: 'Invalid token' })
    }

    req.user = result
  })
}
