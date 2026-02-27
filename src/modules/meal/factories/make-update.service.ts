import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { UpdateService } from '../services/update.service'

export function makeUpdateService() {
	const mealsRepository = new PrismaMealRepository()
	const updateService = new UpdateService(mealsRepository)

	return updateService
}
