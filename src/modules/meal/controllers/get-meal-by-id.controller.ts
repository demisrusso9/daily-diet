import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetMealByIdService } from '../factories/make-get-meal-by-id.service'
import { paramsSchema } from '../schema/list-id-params.schema'

export async function getMealByIdController(
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
