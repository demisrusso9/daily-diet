import { FastifyReply, FastifyRequest } from 'fastify'
import { makeUpdateService } from '../factories/make-update.service'
import { paramsSchema } from '../schema/list-id-params.schema'
import { updateMealSchema } from '../schema/update.schema'
import { MealNotFoundError } from '../services/errors/meal-not-found.error'

export async function updateController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	{
		const { id } = paramsSchema.parse(request.params)
		const data = updateMealSchema.parse(request.body)
		const userId = request.user.sub

		try {
			const updateService = makeUpdateService()
			await updateService.execute({ data, id, userId })

			return reply.status(201).send({ message: 'Meal updated successfully' })
		} catch (error) {
			if (error instanceof MealNotFoundError) {
				return reply.status(404).send({ message: error.message })
			}

			throw error
		}
	}
}
