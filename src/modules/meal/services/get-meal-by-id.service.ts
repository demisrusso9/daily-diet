import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'

interface GetMealByIdServiceParams {
	id: string
	userId: string
}

export class GetMealByIdService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ id, userId }: GetMealByIdServiceParams) {
		return this.mealsRepository.findById(id, userId)
	}
}
