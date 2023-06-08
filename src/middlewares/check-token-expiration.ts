import { FastifyRequest, FastifyReply } from 'fastify'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { env } from '../env'
import { FORBIDDEN, UNAUTHORIZED } from '../utils/statusCode'

export async function checkTokenExpiration(req: FastifyRequest, reply: FastifyReply) {
  const { authorization } = req.headers
  const token = authorization?.split(' ')[1]

  if (!token) {
    return reply
      .code(UNAUTHORIZED)
      .send({ error: true, message: 'Authorization header missing or invalid.' })
  }

  try {
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload

    if (Date.now() < (decodedToken?.exp ?? 0) * 1000) {
      return reply.code(FORBIDDEN).send({ message: 'Access token is still valid' })
    }
  } catch (error) {
    if (!(error instanceof TokenExpiredError)) {
      return reply.code(UNAUTHORIZED).send({ message: 'invalid' })
    }
  }
}
