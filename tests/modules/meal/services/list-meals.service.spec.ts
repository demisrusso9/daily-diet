import { ListMealsService } from '@/modules/meal/services/list-meals.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { beforeEach, describe, expect, it } from 'vitest'

let mealsRepository: InMemoryMealsRepository
let sut: ListMealsService

describe('List Meals Service', () => {
	beforeEach(() => {
		mealsRepository = new InMemoryMealsRepository()
		sut = new ListMealsService(mealsRepository)
	})

	it('should return all meals from a user', async () => {
		await mealsRepository.create({
			name: 'Frango grelhado',
			description: 'Peito de frango com legumes',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		await mealsRepository.create({
			name: 'Pizza',
			description: 'Pizza de calabresa',
			date: new Date(),
			isOnDiet: false,
			userId: 'user-1'
		})

		const meals = await sut.execute({ userId: 'user-1' })

		expect(meals).toHaveLength(2)
	})

	it('should return an empty list when user has no meals', async () => {
		const meals = await sut.execute({ userId: 'user-1' })

		expect(meals).toHaveLength(0)
	})

	it('should return only meals from the requesting user', async () => {
		await mealsRepository.create({
			name: 'Frango grelhado',
			description: 'Peito de frango com legumes',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		await mealsRepository.create({
			name: 'Pizza',
			description: 'Pizza de calabresa',
			date: new Date(),
			isOnDiet: false,
			userId: 'user-2'
		})

		const meals = await sut.execute({ userId: 'user-1' })

		expect(meals).toHaveLength(1)
		expect(meals[0].name).toBe('Frango grelhado')
	})
})
