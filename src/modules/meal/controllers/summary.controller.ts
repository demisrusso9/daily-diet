import { makeSummaryService } from '@/modules/meal/factories/make-summary.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function summaryController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'summaryController' })
	const userId = request.user.sub

	try {
		const summaryService = makeSummaryService()
		const { totalMeals, mealsOnDiet, mealsOffDiet, bestSequenceOnDiet } =
			await summaryService.execute({ userId })

		log.info({ userId }, 'Summary fetched successfully')

		return reply.status(200).send({
			totalMeals,
			mealsOnDiet,
			mealsOffDiet,
			bestSequenceOnDiet
		})
	} catch (error) {
		log.error({ err: error, userId }, 'Unexpected error fetching summary')
		throw error
	}
}
