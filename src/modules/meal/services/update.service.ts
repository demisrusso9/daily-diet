import { MealUpdateInput } from '../../../../prisma/generated/models'
import { MealsRepository } from '../repositories/contracts/meals.repository'
import { MealNotFoundError } from './errors/meal-not-found.error'

interface UpdateServiceParams {
	data: MealUpdateInput
	id: string
	userId: string
}

export class UpdateService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ data, id, userId }: UpdateServiceParams) {
		const checkMealExists = await this.mealsRepository.findById(id, userId)

		if (!checkMealExists) {
			throw new MealNotFoundError()
		}

		await this.mealsRepository.update(data, id, userId)
	}
}
