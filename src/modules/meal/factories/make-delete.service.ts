import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { DeleteService } from '@/modules/meal/services/delete.service'

export function makeDeleteService() {
	const mealsRepository = new PrismaMealRepository()
	const deleteService = new DeleteService(mealsRepository)

	return deleteService
}
