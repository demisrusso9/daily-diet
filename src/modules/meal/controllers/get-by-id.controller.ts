import { makeGetMealByIdService } from '@/modules/meal/factories/make-get-meal-by-id.service'
import { paramsSchema } from '@/modules/meal/schemas/list-id-params.schema'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getByIdController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = paramsSchema.parse(request.params)

	try {
		const getMealByIdService = makeGetMealByIdService()

		const meal = await getMealByIdService.execute({
			id,
			userId: request.user.sub
		})

		return reply.status(200).send({ meal })
	} catch (error) {
		throw error
	}
}
