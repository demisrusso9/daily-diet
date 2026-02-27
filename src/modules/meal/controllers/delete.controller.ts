import { FastifyReply, FastifyRequest } from 'fastify'
import { makeDeleteService } from '../factories/make-delete.service'
import { paramsSchema } from '../schema/list-id-params.schema'
import { MealNotFoundError } from '../services/errors/meal-not-found.error'

export async function deleteController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = paramsSchema.parse(request.params)
	const userId = request.user.sub

	try {
		const deleteService = makeDeleteService()
		await deleteService.execute({ id, userId })

		return reply.status(200).send()
	} catch (error) {
		if (error instanceof MealNotFoundError) {
			return reply.status(404).send({
				message: error.message
			})
		}

		throw error
	}
}
