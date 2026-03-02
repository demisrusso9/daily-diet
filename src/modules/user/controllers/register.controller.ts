import { FastifyReply, FastifyRequest } from 'fastify'

import { makeRegisterService } from '@/modules/user/factories/make-register.service'
import { registerSchema } from '@/modules/user/schemas/register.schema'
import { UserAlreadyExistsError } from '@/modules/user/services/errors/user-already-exists.error'

export async function registerController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'registerController' })
	const { name, email, password } = registerSchema.parse(request.body)

	try {
		const registerService = makeRegisterService()

		await registerService.execute({
			name,
			email,
			password
		})

		log.info({ email }, 'User registered successfully')
		return reply.status(201).send()
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			log.warn({ email }, 'Registration conflict: user already exists')

			return reply.status(409).send({
				error: error.message
			})
		}

		log.error({ err: error, email }, 'Unexpected error during registration')

		throw error
	}
}
