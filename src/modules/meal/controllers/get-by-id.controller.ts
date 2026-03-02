import { makeGetMealByIdService } from '@/modules/meal/factories/make-get-meal-by-id.service'
import { paramsSchema } from '@/modules/meal/schemas/list-id-params.schema'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getByIdController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'getByIdController' })
	const { id } = paramsSchema.parse(request.params)
	const userId = request.user.sub

	try {
		const getMealByIdService = makeGetMealByIdService()

		const meal = await getMealByIdService.execute({ id, userId })

		log.info({ id, userId }, 'Meal fetched successfully')

		return reply.status(200).send({ meal })
	} catch (error) {
		log.error(
			{ err: error, id, userId },
			'Unexpected error fetching meal by id'
		)
		throw error
	}
}
