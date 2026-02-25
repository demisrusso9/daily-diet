import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { checkIfUserIsAuthenticated } from '../middlewares/check-if-user-is-authenticated'
import { getMealByIdController } from '../modules/meal/controllers/get-meal-by-id.controller'
import { listMealsController } from '../modules/meal/controllers/list-meals.controller'
import { summaryController } from '../modules/meal/controllers/summary.controller'

export async function mealRoutes(app: FastifyInstance) {
	app.addHook('preHandler', checkIfUserIsAuthenticated)

	app.get('/list', listMealsController)
	app.get('/list/:id', getMealByIdController)
	app.get('/summary', summaryController)

	app.post('/create', async (request, reply) => {
		const userSchema = z.object({
			name: z.string(),
			description: z.string(),
			date: z.string(),
			isOnDiet: z.boolean()
		})

		const body = userSchema.safeParse(request.body)

		if (!body.success) {
			return reply.status(400).send({
				error: z.treeifyError(body.error)
			})
		}

		const { name, description, date, isOnDiet } = body.data

		try {
			await prisma.meal.create({
				data: {
					id: randomUUID(),
					name,
					description,
					date,
					isOnDiet,
					userId: request.user.sub
				}
			})

			return reply.status(201).send({ message: 'Meal created successfully' })
		} catch (error) {
			return reply.status(500).send({
				error: 'Error creating meal'
			})
		}
	})

	app.patch('/update/:id', async (request, reply) => {
		const userSchema = z.object({
			name: z.string().optional(),
			description: z.string().optional(),
			date: z.string().optional(),
			isOnDiet: z.boolean().optional()
		})

		const body = userSchema.safeParse(request.body)

		if (!body.success) {
			return reply.status(400).send({
				error: z.treeifyError(body.error)
			})
		}

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
		const { name, description, date, isOnDiet } = body.data

		const checkMealExists = await prisma.meal.findFirst({
			where: {
				id,
				userId: request.user.sub
			}
		})

		if (!checkMealExists) {
			return reply.status(404).send({
				error: 'Meal not found'
			})
		}

		try {
			await prisma.meal.update({
				data: {
					name,
					description,
					date,
					isOnDiet,
					userId: request.user.sub
				},
				where: {
					id,
					userId: request.user.sub
				}
			})

			return reply.status(201).send({ message: 'Meal updated successfully' })
		} catch (error) {
			return reply.status(500).send({
				error: 'Error updating meal'
			})
		}
	})

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
