import { makeSummaryService } from '@/modules/meal/factories/make-summary.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function summaryController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const summaryService = makeSummaryService()
		const { totalMeals, mealsOnDiet, mealsOffDiet, bestSequenceOnDiet } =
			await summaryService.execute({ userId: request.user.sub })

		return reply.status(200).send({
			totalMeals,
			mealsOnDiet,
			mealsOffDiet,
			bestSequenceOnDiet
		})
	} catch (error) {
		throw error
	}
}
