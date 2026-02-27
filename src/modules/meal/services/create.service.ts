import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { MealCreateManyInput } from '@prisma/generated/models'

export class CreateService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute(data: MealCreateManyInput) {
		await this.mealsRepository.create(data)
	}
}
