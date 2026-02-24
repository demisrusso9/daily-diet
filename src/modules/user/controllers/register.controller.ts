import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeRegisterService } from '../factories/make-register-service'
import { registerSchema } from '../schemas/register.schema'
import { UserAlreadyExistsError } from '../services/errors/user-already-exists.error'

export async function registerController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = registerSchema.safeParse(request.body)

	if (!body.success) {
		return reply.status(400).send({
			error: z.treeifyError(body.error)
		})
	}

	try {
		const { name, email, password } = body.data

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
