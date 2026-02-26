import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenService } from '../../token/services/generate-token.service'
import { makeLoginService } from '../factories/make-login-service'
import { loginSchema } from '../schemas/login.schema'
import { InvalidCredentialsError } from '../services/errors/invalid-credentials.error'

export async function loginController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { email, password } = loginSchema.parse(request.body)

	try {
		const loginService = makeLoginService()

		const user = await loginService.execute({ email, password })

		const jwtSign = request.server.jwt.sign.bind(request.server.jwt)
		const tokenService = new TokenService(jwtSign)

		const token = tokenService.generateToken(user.id)

		return reply.send({ token })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(401).send({
				error: error.message
			})
		}

		throw error
	}
}
