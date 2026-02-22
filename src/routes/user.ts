import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../services/prisma'

export async function userRoutes(app: FastifyInstance) {
	app.post('/create', async (request, reply) => {
		const userSchema = z.object({
			name: z.string().max(50),
			email: z.email(),
			password: z.string().min(6)
		})

		const body = userSchema.safeParse(request.body)

		if (!body.success) {
			return reply.status(400).send({
				error: z.treeifyError(body.error)
			})
		}

		const checkIfUserExists = await prisma.user.findUnique({
			where: {
				email: body.data.email
			}
		})

		if (checkIfUserExists) {
			return reply.status(400).send({
				error: 'User already exists'
			})
		}

		try {
			await prisma.user.create({
				data: {
					name: body.data.name,
					email: body.data.email,
					password: body.data.password
				}
			})

			return reply.status(201).send()
		} catch (error) {
			return reply.status(500).send({
				error: 'Failed to create user'
			})
		}
	})
}
