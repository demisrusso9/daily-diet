import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { CreateService } from '@/modules/meal/services/create.service'

export function makeCreate() {
	const mealsRepository = new PrismaMealRepository()
	const createService = new CreateService(mealsRepository)

	return createService
}
