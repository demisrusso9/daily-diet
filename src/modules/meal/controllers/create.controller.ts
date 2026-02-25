import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreate } from '../factories/make-create.service'
import { createMealSchema } from '../schema/create.schema'

export async function createController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = createMealSchema.safeParse(request.body)

	if (!body.success) {
		return reply.status(400).send({
			error: z.treeifyError(body.error)
		})
	}

	try {
		const userId = request.user.sub

		const makeCreateService = makeCreate()
		await makeCreateService.execute({ ...body.data, userId })

		return reply.status(201).send({ message: 'Meal created successfully' })
	} catch (error) {
		throw error
	}
}
