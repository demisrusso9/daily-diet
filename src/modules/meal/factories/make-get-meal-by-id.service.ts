import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { GetMealByIdService } from '@/modules/meal/services/get-meal-by-id.service'

export function makeGetMealByIdService() {
	const mealsRepository = new PrismaMealRepository()
	const listMealsService = new GetMealByIdService(mealsRepository)

	return listMealsService
}
