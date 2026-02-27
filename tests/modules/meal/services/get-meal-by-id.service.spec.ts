import { GetMealByIdService } from '@/modules/meal/services/get-meal-by-id.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { beforeEach, describe, expect, it } from 'vitest'

let mealsRepository: InMemoryMealsRepository
let sut: GetMealByIdService

describe('Get Meal By Id Service', () => {
	beforeEach(() => {
		mealsRepository = new InMemoryMealsRepository()
		sut = new GetMealByIdService(mealsRepository)
	})

	it('should return a meal by id', async () => {
		await mealsRepository.create({
			name: 'Frango grelhado',
			description: 'Peito de frango com legumes',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		const { id } = mealsRepository.meals[0]

		const meal = await sut.execute({ id, userId: 'user-1' })

		expect(meal).not.toBeNull()
		expect(meal?.id).toBe(id)
		expect(meal?.name).toBe('Frango grelhado')
	})

	it('should return null when meal does not exist', async () => {
		const meal = await sut.execute({ id: 'non-existing-id', userId: 'user-1' })

		expect(meal).toBeNull()
	})

	it('should not return a meal that belongs to another user', async () => {
		await mealsRepository.create({
			name: 'Frango grelhado',
			description: 'Peito de frango com legumes',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		const { id } = mealsRepository.meals[0]

		const meal = await sut.execute({ id, userId: 'user-2' })

		expect(meal).toBeNull()
	})
})
