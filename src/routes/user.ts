import { refreshController } from '@/modules/user/controllers/refresh.controller'
import { registerController } from '@/modules/user/controllers/register.controller'
import { sessionController } from '@/modules/user/controllers/session.controller'
import {
	refreshDocs,
	registerDocs,
	sessionDocs
} from '@/modules/user/docs/user.docs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function userRoutes(app: FastifyInstance) {
	const router = app.withTypeProvider<ZodTypeProvider>()

	router.post(
		'/create',
		{ schema: registerDocs, attachValidation: true },
		registerController
	)
	router.post(
		'/session',
		{ schema: sessionDocs, attachValidation: true },
		sessionController
	)
	router.get(
		'/refresh',
		{ schema: refreshDocs, attachValidation: true },
		refreshController
	)
}
