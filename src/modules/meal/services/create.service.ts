import { MealCreateManyInput } from '../../../../prisma/generated/models'
import { MealsRepository } from '../repositories/contracts/meals.repository'

export class CreateService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute(data: MealCreateManyInput) {
		await this.mealsRepository.create(data)
	}
}
