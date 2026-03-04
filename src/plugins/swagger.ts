// src/plugins/swagger.ts
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const swaggerPlugin = fp(async (app: FastifyInstance) => {
	await app.register(swagger, {
		openapi: {
			info: {
				title: 'Daily Diet API',
				description: '...',
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

	await app.register(swaggerUi, {
		routePrefix: '/docs',
		uiConfig: { docExpansion: 'list', deepLinking: true }
	})
})
