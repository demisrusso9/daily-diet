import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { DeleteAllService } from '@/modules/meal/services/delete-all.service'

export function makeDeleteAllService() {
	const mealsRepository = new PrismaMealRepository()
	const deleteAllService = new DeleteAllService(mealsRepository)

	return deleteAllService
}
