import { FastifyReply, FastifyRequest } from 'fastify'
import { makeDeleteAllService } from '../factories/make-delete-all.service'

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
