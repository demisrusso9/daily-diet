import { makeDeleteAllService } from '@/modules/meal/factories/make-delete-all.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteAllController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const log = request.log.child({ context: 'deleteAllController' })
	const userId = request.user.sub

	try {
		const deleteAllService = makeDeleteAllService()
		await deleteAllService.execute({ userId })

		log.info({ userId }, 'All meals deleted successfully')

		return reply.status(200).send()
	} catch (error) {
		log.error({ err: error, userId }, 'Unexpected error deleting all meals')
		throw error
	}
}
