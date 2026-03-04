import { env } from '@/envs/env'
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

const app = fastify({
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

app.listen({ port: env.PORT, host: env.HOST }, () => {
	app.log.info({ host: env.HOST, port: env.PORT }, 'Server listening')
	app.log.info(
		{ url: `http://${env.HOST}:${env.PORT}/docs` },
		'Swagger docs available'
	)
})
