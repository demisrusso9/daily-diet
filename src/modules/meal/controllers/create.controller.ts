import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreate } from '../factories/make-create.service'
import { createMealSchema } from '../schema/create.schema'

export async function createController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = createMealSchema.parse(request.body)

	try {
		const userId = request.user.sub

		const makeCreateService = makeCreate()
		await makeCreateService.execute({ ...body, userId })

		return reply.status(201).send({ message: 'Meal created successfully' })
	} catch (error) {
		throw error
	}
}
