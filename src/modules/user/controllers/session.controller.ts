import { env } from '@/envs/env'
import { makeSessionService } from '@/modules/user/factories/make-session.service'
import { sessionSchema } from '@/modules/user/schemas/login.schema'
import { InvalidCredentialsError } from '@/modules/user/services/errors/invalid-credentials.error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function sessionController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'sessionController' })
	const { email, password } = sessionSchema.parse(request.body)

	try {
		const sessionService = makeSessionService()

		const user = await sessionService.execute({ email, password })

		const token = await reply.jwtSign({ sub: user.id })
		const refreshToken = await reply.jwtSign(
			{ sub: user.id },
			{ sign: { expiresIn: '7d' } }
		)

		log.info({ email }, 'User logged in successfully')

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: env.NODE_ENV === 'production',
				sameSite: true
			})
			.status(200)
			.send({ token, refreshToken })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			log.warn({ email }, 'Login attempt with invalid credentials')
			return reply.status(401).send({
				error: error.message
			})
		}

		log.error({ err: error, email }, 'Unexpected error during login')
		throw error
	}
}
