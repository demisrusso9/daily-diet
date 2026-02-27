import { loginController } from '@/modules/user/controllers/login.controller'
import { registerController } from '@/modules/user/controllers/register.controller'
import { FastifyInstance } from 'fastify'

export async function userRoutes(app: FastifyInstance) {
	app.post('/create', registerController)
	app.post('/login', loginController)
}
