import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { UpdateMealDTO } from '@/modules/meal/schema/update.schema'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'

interface UpdateServiceParams {
	data: UpdateMealDTO
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
