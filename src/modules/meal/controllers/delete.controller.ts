import { makeDeleteService } from '@/modules/meal/factories/make-delete.service'
import { paramsSchema } from '@/modules/meal/schemas/list-id-params.schema'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'deleteController' })
	const { id } = paramsSchema.parse(request.params)
	const userId = request.user.sub

	try {
		const deleteService = makeDeleteService()
		await deleteService.execute({ id, userId })

		log.info({ id, userId }, 'Meal deleted successfully')

		return reply.status(200).send()
	} catch (error) {
		if (error instanceof MealNotFoundError) {
			log.warn({ id, userId }, 'Meal not found for deletion')
			return reply.status(404).send({
				message: error.message
			})
		}

		log.error({ err: error, id, userId }, 'Unexpected error deleting meal')
		throw error
	}
}
