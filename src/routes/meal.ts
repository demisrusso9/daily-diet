import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { checkIfUserIsAuthenticated } from '../middlewares/check-if-user-is-authenticated'
import { prisma } from '../services/prisma'

export async function mealRoutes(app: FastifyInstance) {
	app.addHook('preHandler', checkIfUserIsAuthenticated)

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
}
