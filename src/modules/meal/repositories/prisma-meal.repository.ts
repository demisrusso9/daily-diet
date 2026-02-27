import { prisma } from '@/lib/prisma'
import { MealsRepository } from '@/modules/meal/repositories/contracts/meals.repository'
import { CreateMealDTO } from '@/modules/meal/schema/create.schema'
import { UpdateMealDTO } from '@/modules/meal/schema/update.schema'

export class PrismaMealRepository implements MealsRepository {
	async create(data: CreateMealDTO & { userId: string }) {
		await prisma.meal.create({ data })
	}

	async update(data: UpdateMealDTO, id: string, userId: string) {
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
