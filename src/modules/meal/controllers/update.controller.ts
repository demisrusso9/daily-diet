import { makeUpdateService } from '@/modules/meal/factories/make-update.service'
import { paramsSchema } from '@/modules/meal/schema/list-id-params.schema'
import { updateMealSchema } from '@/modules/meal/schema/update.schema'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'
import { FastifyReply, FastifyRequest } from 'fastify'

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
