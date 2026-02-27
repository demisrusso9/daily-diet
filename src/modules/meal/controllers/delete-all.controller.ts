import { makeDeleteAllService } from '@/modules/meal/factories/make-delete-all.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteAllController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const userId = request.user.sub

	try {
		const deleteAllService = makeDeleteAllService()
		await deleteAllService.execute({ userId })

		return reply.status(200).send()
	} catch (error) {
		throw error
	}
}
