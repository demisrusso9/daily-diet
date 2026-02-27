import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { DeleteService } from '../services/delete.service'

export function makeDeleteService() {
	const mealsRepository = new PrismaMealRepository()
	const deleteService = new DeleteService(mealsRepository)

	return deleteService
}
