import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { UpdateService } from '@/modules/meal/services/update.service'

export function makeUpdateService() {
	const mealsRepository = new PrismaMealRepository()
	const updateService = new UpdateService(mealsRepository)

	return updateService
}
