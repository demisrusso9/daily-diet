import fastify from 'fastify'
import { JwtPayload } from 'jsonwebtoken'

declare module 'fastify' {
  export interface FastifyRequest {
    user: string | JwtPayload | undefined
  }
}
