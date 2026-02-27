import { prisma } from '@/lib/prisma'
import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { MealCreateManyInput, MealUpdateInput } from '@prisma/generated/models'

export class PrismaMealRepository implements MealsRepository {
	async create(data: MealCreateManyInput) {
		await prisma.meal.create({ data })
	}

	async update(data: MealUpdateInput, id: string, userId: string) {
		await prisma.meal.update({
			data,
			where: { id, userId }
		})
	}

	async getAllMeals(userId: string) {
		const meals = await prisma.meal.findMany({
			where: { userId }
		})

		return meals
	}

	async findById(id: string, userId: string) {
		const meal = await prisma.meal.findFirst({
			where: { id, userId }
		})

		return meal
	}

	async deleteById(id: string, userId: string) {
		await prisma.meal.delete({
			where: { id, userId }
		})
	}

	async deleteAll(userId: string) {
		await prisma.meal.deleteMany({
			where: { userId }
		})
	}
}
