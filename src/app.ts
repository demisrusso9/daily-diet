import { env } from '@/envs/env'
import { mealRoutes } from '@/routes/meal'
import { userRoutes } from '@/routes/user'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler
} from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swagger, {
	openapi: {
		info: {
			title: 'Daily Diet API',
			description:
				'API REST para controle de dieta diária. Registre refeições, acompanhe sua dieta e visualize métricas de desempenho.',
			version: '1.0.0'
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Token JWT obtido no endpoint /users/login'
				}
			}
		}
	},
	transform: jsonSchemaTransform
})

app.register(swaggerUi, {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'list',
		deepLinking: true
	}
})

app.register(jwt, { secret: env.JWT_SECRET })

app.register(userRoutes, { prefix: 'users' })
app.register(mealRoutes, { prefix: 'meals' })

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation Error',
			issues: z.prettifyError(error)
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
