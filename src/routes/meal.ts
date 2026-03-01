import { checkIfUserIsAuthenticated } from '@/middlewares/check-if-user-is-authenticated'
import { createController } from '@/modules/meal/controllers/create.controller'
import { deleteAllController } from '@/modules/meal/controllers/delete-all.controller'
import { deleteController } from '@/modules/meal/controllers/delete.controller'
import { getByIdController } from '@/modules/meal/controllers/get-by-id.controller'
import { listController } from '@/modules/meal/controllers/list.controller'
import { summaryController } from '@/modules/meal/controllers/summary.controller'
import { updateController } from '@/modules/meal/controllers/update.controller'
import {
	createMealDocs,
	deleteAllMealsDocs,
	deleteMealDocs,
	getMealByIdDocs,
	listMealsDocs,
	summaryDocs,
	updateMealDocs
} from '@/modules/meal/docs/meal.docs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function mealRoutes(app: FastifyInstance) {
	const router = app.withTypeProvider<ZodTypeProvider>()

	router.addHook('preHandler', checkIfUserIsAuthenticated)

	router.get(
		'/list',
		{ schema: listMealsDocs, attachValidation: true },
		listController
	)
	router.get(
		'/list/:id',
		{ schema: getMealByIdDocs, attachValidation: true },
		getByIdController
	)
	router.get(
		'/summary',
		{ schema: summaryDocs, attachValidation: true },
		summaryController
	)
	router.post(
		'/create',
		{ schema: createMealDocs, attachValidation: true },
		createController
	)
	router.patch(
		'/update/:id',
		{ schema: updateMealDocs, attachValidation: true },
		updateController
	)
	router.delete(
		'/delete/:id',
		{ schema: deleteMealDocs, attachValidation: true },
		deleteController
	)
	router.delete(
		'/delete-all',
		{ schema: deleteAllMealsDocs },
		deleteAllController
	)
}
