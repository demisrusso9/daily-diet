import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { ListMealsService } from '@/modules/meal/services/list-meals.service'

export function makeListMealsService() {
	const mealsRepository = new PrismaMealRepository()
	const listMealsService = new ListMealsService(mealsRepository)

	return listMealsService
}
