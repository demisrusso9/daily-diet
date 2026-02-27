import { FastifyReply, FastifyRequest } from 'fastify'

import { makeRegisterService } from '@/modules/user/factories/make-register.service'
import { registerSchema } from '@/modules/user/schemas/register.schema'
import { UserAlreadyExistsError } from '@/modules/user/services/errors/user-already-exists.error'

export async function registerController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { name, email, password } = registerSchema.parse(request.body)

	try {
		const registerService = makeRegisterService()

		await registerService.execute({
			name,
			email,
			password
		})

		return reply.status(201).send()
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({
				error: error.message
			})
		}

		throw error
	}
}
