import { TokenService } from '@/modules/token/services/token.service'
import { makeLoginService } from '@/modules/user/factories/make-login.service'
import { loginSchema } from '@/modules/user/schemas/login.schema'
import { InvalidCredentialsError } from '@/modules/user/services/errors/invalid-credentials.error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function loginController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'loginController' })
	const { email, password } = loginSchema.parse(request.body)

	try {
		const loginService = makeLoginService()

		const user = await loginService.execute({ email, password })

		const jwtSign = request.server.jwt.sign.bind(request.server.jwt)
		const tokenService = new TokenService(jwtSign)

		const token = tokenService.generateToken(user.id)

		log.info({ email }, 'User logged in successfully')

		return reply.send({ token })
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
