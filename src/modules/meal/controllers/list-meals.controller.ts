import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListMealsService } from '../factories/make-list.service'

export async function listMealsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const listMealsService = makeListMealsService()

		const meals = await listMealsService.execute({ userId: request.user.sub })

		return reply.status(200).send({ meals })
	} catch (error) {
		throw error
	}
}
