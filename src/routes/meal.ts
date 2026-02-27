import { checkIfUserIsAuthenticated } from '@/middlewares/check-if-user-is-authenticated'
import { createController } from '@/modules/meal/controllers/create.controller'
import { deleteAllController } from '@/modules/meal/controllers/delete-all.controller'
import { deleteController } from '@/modules/meal/controllers/delete.controller'
import { getByIdController } from '@/modules/meal/controllers/get-by-id.controller'
import { listController } from '@/modules/meal/controllers/list.controller'
import { summaryController } from '@/modules/meal/controllers/summary.controller'
import { updateController } from '@/modules/meal/controllers/update.controller'
import { FastifyInstance } from 'fastify'

export async function mealRoutes(app: FastifyInstance) {
	app.addHook('preHandler', checkIfUserIsAuthenticated)

	app.get('/list', listController)
	app.get('/list/:id', getByIdController)
	app.get('/summary', summaryController)
	app.post('/create', createController)
	app.patch('/update/:id', updateController)
	app.delete('/delete/:id', deleteController)
	app.delete('/delete-all', deleteAllController)
}
