import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { CreateMealDTO } from '@/modules/meal/schema/create.schema'

export class CreateService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute(data: CreateMealDTO & { userId: string }) {
		await this.mealsRepository.create(data)
	}
}
