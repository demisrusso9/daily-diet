import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { DeleteAllService } from '../services/delete-all.service'

export function makeDeleteAllService() {
	const mealsRepository = new PrismaMealRepository()
	const deleteAllService = new DeleteAllService(mealsRepository)

	return deleteAllService
}
