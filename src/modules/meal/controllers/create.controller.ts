import { makeCreate } from '@/modules/meal/factories/make-create.service'
import { createMealSchema } from '@/modules/meal/schemas/create.schema'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'createController' })
	const body = createMealSchema.parse(request.body)
	const userId = request.user.sub

	try {
		const makeCreateService = makeCreate()
		await makeCreateService.execute({ ...body, userId })

		log.info({ userId }, 'Meal created successfully')

		return reply.status(201).send({ message: 'Meal created successfully' })
	} catch (error) {
		log.error({ err: error, userId }, 'Unexpected error during meal creation')
		throw error
	}
}
