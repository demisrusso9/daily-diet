import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { checkIfUserIsAuthenticated } from '../middlewares/check-if-user-is-authenticated'
import { createController } from '../modules/meal/controllers/create.controller'
import { getMealByIdController } from '../modules/meal/controllers/get-meal-by-id.controller'
import { listMealsController } from '../modules/meal/controllers/list-meals.controller'
import { summaryController } from '../modules/meal/controllers/summary.controller'
import { updateController } from '../modules/meal/controllers/update.controller'

export async function mealRoutes(app: FastifyInstance) {
	app.addHook('preHandler', checkIfUserIsAuthenticated)

	app.get('/list', listMealsController)
	app.get('/list/:id', getMealByIdController)
	app.get('/summary', summaryController)
	app.post('/create', createController)
	app.patch('/update/:id', updateController)

	app.delete('/delete/:id', async (request, reply) => {
		const paramsSchema = z.object({
			id: z.string()
		})

		const params = paramsSchema.safeParse(request.params)

		if (!params.success) {
			return reply.status(400).send({
				error: z.treeifyError(params.error)
			})
		}

		const { id } = params.data

		try {
			await prisma.meal.delete({
				where: {
					id,
					userId: request.user.sub
				}
			})

			return reply.status(200).send()
		} catch (error) {
			return reply.status(500).send({
				error: 'Error deleting meal'
			})
		}
	})

	app.delete('/delete-all', async (request, reply) => {
		try {
			await prisma.meal.deleteMany({
				where: {
					userId: request.user.sub
				}
			})
			return reply
				.status(200)
				.send({ message: 'All meals deleted successfully' })
		} catch (error) {
			return reply.status(500).send({
				error: 'Error deleting all meals'
			})
		}
	})
}
