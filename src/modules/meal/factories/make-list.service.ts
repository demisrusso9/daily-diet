import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { ListMealsService } from '../services/list-meals.service'

export function makeListMealsService() {
	const mealsRepository = new PrismaMealRepository()
	const listMealsService = new ListMealsService(mealsRepository)

	return listMealsService
}
