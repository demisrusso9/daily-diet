import fastify from 'fastify'
import { JwtPayload } from 'jsonwebtoken'

interface User {
  id: string
  email: string
}

declare module 'fastify' {
  export interface FastifyRequest {
    user: string | JwtPayload<User> | undefined
  }
}
