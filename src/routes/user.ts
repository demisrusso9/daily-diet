import { FastifyInstance } from 'fastify'
import { loginController } from '../modules/user/controllers/login.controller'
import { registerController } from '../modules/user/controllers/register.controller'

export async function userRoutes(app: FastifyInstance) {
	app.post('/create', registerController)
	app.post('/login', loginController)
}
