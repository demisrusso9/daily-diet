import { mealRoutes } from '@/routes/meal'
import { userRoutes } from '@/routes/user'
import fastify, { FastifyError } from 'fastify'
import {
	serializerCompiler,
	validatorCompiler
} from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { jwtPlugin } from './plugins/jwt'
import { swaggerPlugin } from './plugins/swagger'
import { healthCheckRoutes } from './routes/healthcheck'

export const app = fastify({
	logger: true,
	disableRequestLogging: true
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swaggerPlugin)
app.register(jwtPlugin)

app.register(userRoutes, { prefix: 'users' })
app.register(mealRoutes, { prefix: 'meals' })
app.register(healthCheckRoutes)

app.setErrorHandler((error: FastifyError, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation Error',
			issues: z.prettifyError(error)
		})
	}

	return reply.status(500).send({
		message: 'Internal Server Error'
	})
})
