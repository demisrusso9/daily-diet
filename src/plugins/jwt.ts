import { env } from '@/envs/env'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const jwtPlugin = fp(async (app: FastifyInstance) => {
	await app.register(cookie)
	await app.register(jwt, {
		secret: env.JWT_SECRET,
		sign: { expiresIn: '15m' },
		cookie: { cookieName: 'refreshToken', signed: false }
	})
})
