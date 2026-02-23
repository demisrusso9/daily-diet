import jwt from '@fastify/jwt'
import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { env } from './envs/env'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'

const app = fastify()

app.register(jwt, { secret: env.JWT_SECRET })

app.register(userRoutes, { prefix: 'users' })
app.register(mealRoutes, { prefix: 'meals' })

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation Error',
			issues: z.treeifyError(error)
		})
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	}

	return reply.status(500).send({
		message: 'Internal Server Error'
	})
})

app.listen({ port: env.PORT }, () => {
	console.log(`Server listening at ${env.PORT}`)
})
