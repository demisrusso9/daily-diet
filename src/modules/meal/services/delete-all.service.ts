import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'

interface DeleteAllServiceParams {
	userId: string
}

export class DeleteAllService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ userId }: DeleteAllServiceParams) {
		await this.mealsRepository.deleteAll(userId)
	}
}
