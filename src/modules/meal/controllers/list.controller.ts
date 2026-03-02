import { makeListMealsService } from '@/modules/meal/factories/make-list.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function listController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'listController' })
	const userId = request.user.sub

	try {
		const listMealsService = makeListMealsService()

		const meals = await listMealsService.execute({ userId })

		log.info({ userId }, 'Meals listed successfully')

		return reply.status(200).send({ meals })
	} catch (error) {
		log.error({ err: error, userId }, 'Unexpected error listing meals')
		throw error
	}
}
