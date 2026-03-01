import { loginController } from '@/modules/user/controllers/login.controller'
import { registerController } from '@/modules/user/controllers/register.controller'
import { loginDocs, registerDocs } from '@/modules/user/docs/user.docs'
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
		'/login',
		{ schema: loginDocs, attachValidation: true },
		loginController
	)
}
