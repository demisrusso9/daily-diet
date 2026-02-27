import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { CreateMealDTO } from '@/modules/meal/schemas/create.schema'
import { MealDTO } from '@/modules/meal/schemas/meal.schema'
import { UpdateMealDTO } from '@/modules/meal/schemas/update.schema'
import { randomUUID } from 'node:crypto'

export class InMemoryMealsRepository implements MealsRepository {
	public meals: MealDTO[] = []

	async create(data: CreateMealDTO & { userId: string }): Promise<void> {
		this.meals.push({
			id: randomUUID(),
			updatedAt: new Date(),
			...data
		})
	}

	async update(data: UpdateMealDTO, id: string, userId: string): Promise<void> {
		const index = this.meals.findIndex(
			(meal) => meal.id === id && meal.userId === userId
		)

		if (index === -1) return

		this.meals[index] = {
			...this.meals[index],
			...data,
			updatedAt: new Date()
		}
	}

	async getAllMeals(userId: string): Promise<MealDTO[]> {
		return this.meals.filter((meal) => meal.userId === userId)
	}

	async findById(id: string, userId: string): Promise<MealDTO | null> {
		return (
			this.meals.find((meal) => meal.id === id && meal.userId === userId) ??
			null
		)
	}

	async deleteById(id: string, userId: string): Promise<void> {
		this.meals = this.meals.filter(
			(meal) => !(meal.id === id && meal.userId === userId)
		)
	}

	async deleteAll(userId: string): Promise<void> {
		this.meals = this.meals.filter((meal) => meal.userId !== userId)
	}
}
