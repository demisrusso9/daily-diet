import { MealsRepository } from '../repositories/contracts/meals.repository'

interface ListMealsServiceParams {
	userId: string
}

export class ListMealsService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ userId }: ListMealsServiceParams) {
		return this.mealsRepository.getAllMeals(userId)
	}
}
