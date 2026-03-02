import { env } from '@/envs/env'
import { mealRoutes } from '@/routes/meal'
import { userRoutes } from '@/routes/user'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastify, { FastifyError } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler
} from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { healthCheckRoutes } from './routes/healthcheck'

const app = fastify({
	logger: true
})

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

app.register(cookie)
app.register(jwt, {
	secret: env.JWT_SECRET,
	sign: { expiresIn: '15m' },
	cookie: { cookieName: 'refreshToken', signed: false }
})

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
