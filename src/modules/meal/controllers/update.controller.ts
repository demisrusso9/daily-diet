import { makeUpdateService } from '@/modules/meal/factories/make-update.service'
import { paramsSchema } from '@/modules/meal/schemas/list-id-params.schema'
import { updateMealSchema } from '@/modules/meal/schemas/update.schema'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function updateController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'updateController' })

	const { id } = paramsSchema.parse(request.params)
	const data = updateMealSchema.parse(request.body)
	const userId = request.user.sub

	try {
		const updateService = makeUpdateService()
		await updateService.execute({ data, id, userId })

		log.info({ id, userId }, 'Meal updated successfully')

		return reply.status(201).send({ message: 'Meal updated successfully' })
	} catch (error) {
		if (error instanceof MealNotFoundError) {
			log.warn({ id, userId }, 'Meal not found for update')
			return reply.status(404).send({ message: error.message })
		}

		log.error({ err: error, id, userId }, 'Unexpected error updating meal')
		throw error
	}
}
