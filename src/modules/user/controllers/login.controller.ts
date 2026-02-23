import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TokenService } from '../../token/services/generate-token.service'
import { PrismaUsersRepository } from '../repositories/prisma-users.repository'
import { loginSchema } from '../schemas/login.schema'
import { InvalidCredentialsError } from '../services/errors/invalid-credentials.error'
import { LoginService } from '../services/login.service'

export async function loginController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const loginData = loginSchema.safeParse(request.body)

	if (!loginData.success) {
		return reply.status(400).send({
			error: z.treeifyError(loginData.error)
		})
	}

	const { email, password } = loginData.data

	try {
		const userRepository = new PrismaUsersRepository()
		const loginService = new LoginService(userRepository)

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
