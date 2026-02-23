import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { registerController } from '../modules/user/controllers/register.controller'

export async function userRoutes(app: FastifyInstance) {
	app.post('/create', registerController)

	app.post('/login', async (request, reply) => {
		const loginSchema = z.object({
			email: z.email(),
			password: z.string().min(6)
		})

		const body = loginSchema.safeParse(request.body)

		if (!body.success) {
			return reply.status(400).send({
				error: z.treeifyError(body.error)
			})
		}

		const user = await prisma.user.findUnique({
			where: {
				email: body.data.email
			}
		})

		if (!user) {
			return reply.status(401).send({
				error: 'Invalid credentials'
			})
		}

		const passwordMatch = await bcrypt.compare(
			body.data.password,
			user.password
		)

		if (!passwordMatch) {
			return reply.status(401).send({
				error: 'Invalid credentials'
			})
		}

		const token = app.jwt.sign(
			{ sub: user.id },
			{
				expiresIn: '1d'
			}
		)

		return reply.send({
			token
		})
	})
}
