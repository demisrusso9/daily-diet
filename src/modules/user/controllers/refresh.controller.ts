import { env } from '@/envs/env'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refreshController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'refreshController' })
	await request.jwtVerify({ onlyCookie: true })

	const userId = request.user.sub

	const token = await reply.jwtSign({ sub: userId })
	const refreshToken = await reply.jwtSign(
		{ sub: userId },
		{ sign: { expiresIn: '7d' } }
	)

	log.info({ userId }, 'Token refreshed successfully')

	return reply
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict'
		})
		.status(200)
		.send({ token })
}
