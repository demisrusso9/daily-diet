import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'

interface DeleteServiceParams {
	id: string
	userId: string
}

export class DeleteService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ id, userId }: DeleteServiceParams) {
		const checkIfMealExists = await this.mealsRepository.findById(id, userId)

		if (!checkIfMealExists) {
			throw new MealNotFoundError()
		}

		await this.mealsRepository.deleteById(id, userId)
	}
}
