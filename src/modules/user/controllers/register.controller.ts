import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { PrismaUsersRepository } from '../repositories/prisma-users.repository'
import { registerSchema } from '../schemas/register.schema'
import { UserAlreadyExistsError } from '../services/errors/user-already-exists.error'
import { RegisterService } from '../services/register.service'

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

		const userRepository = new PrismaUsersRepository()
		const registerService = new RegisterService(userRepository)

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
