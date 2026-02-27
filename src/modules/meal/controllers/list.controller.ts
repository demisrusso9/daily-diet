import { makeListMealsService } from '@/modules/meal/factories/make-list.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function listController(
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
