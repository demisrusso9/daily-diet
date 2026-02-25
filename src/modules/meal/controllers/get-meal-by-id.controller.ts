import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGetMealByIdService } from '../factories/make-get-meal-by-id.service'
import { paramsSchema } from '../schema/list-id-params.schema'

export async function getMealByIdController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const params = paramsSchema.safeParse(request.params)

		if (!params.success) {
			return reply.status(400).send({
				error: z.treeifyError(params.error)
			})
		}

		const { id } = params.data

		const getMealByIdService = makeGetMealByIdService()

		const meal = await getMealByIdService.execute({
			id,
			userId: request.user.sub
		})

		return reply.status(200).send({ meal })
	} catch (error) {
		throw error
	}
}
