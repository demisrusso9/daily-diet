import { MealsRepository } from '../repositories/contracts/meals.repository'

interface SummaryServiceParams {
	userId: string
}

export class SummaryService {
	constructor(private mealsRepository: MealsRepository) {}

	async execute({ userId }: SummaryServiceParams) {
		const meals = await this.mealsRepository.getAllMeals(userId)

		const totalMeals = meals.length
		const mealsOnDiet = meals.filter((meal) => meal.isOnDiet).length
		const mealsOffDiet = totalMeals - mealsOnDiet

		const { maxSequence } = meals.reduce(
			(acc, meal) => {
				if (meal.isOnDiet) {
					acc.currentSequence++
				} else {
					acc.currentSequence = 0
				}

				acc.maxSequence = Math.max(acc.maxSequence, acc.currentSequence)
				return acc
			},
			{ currentSequence: 0, maxSequence: 0 }
		)

		return {
			totalMeals,
			mealsOnDiet,
			mealsOffDiet,
			bestSequenceOnDiet: maxSequence
		}
	}
}
