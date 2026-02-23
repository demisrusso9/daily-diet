import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'

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
			const saltOrRounds = 10
			const hashedPassword = await bcrypt.hash(body.data.password, saltOrRounds)

			await prisma.user.create({
				data: {
					name: body.data.name,
					email: body.data.email,
					password: hashedPassword
				}
			})

			return reply.status(201).send()
		} catch (error) {
			return reply.status(500).send({
				error: 'Failed to create user'
			})
		}
	})

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
