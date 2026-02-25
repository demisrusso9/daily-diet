import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { CreateService } from '../services/create.service'

export function makeCreate() {
	const mealsRepository = new PrismaMealRepository()
	const createService = new CreateService(mealsRepository)

	return createService
}
