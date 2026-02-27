import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'
import { UpdateService } from '@/modules/meal/services/update.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { beforeEach, describe, expect, it } from 'vitest'

let mealsRepository: InMemoryMealsRepository
let sut: UpdateService

describe('Update Service', () => {
	beforeEach(async () => {
		mealsRepository = new InMemoryMealsRepository()
		sut = new UpdateService(mealsRepository)

		await mealsRepository.create({
			name: 'Frango grelhado',
			description: 'Peito de frango com legumes',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
	})

	it('should update a meal', async () => {
		const { id } = mealsRepository.meals[0]

		await sut.execute({
			id,
			userId: 'user-1',
			data: { name: 'Frango assado', isOnDiet: false }
		})

		expect(mealsRepository.meals[0].name).toBe('Frango assado')
		expect(mealsRepository.meals[0].isOnDiet).toBe(false)
	})

	it('should throw MealNotFoundError when meal does not exist', async () => {
		await expect(
			sut.execute({
				id: 'non-existing-id',
				userId: 'user-1',
				data: { name: 'Updated' }
			})
		).rejects.toBeInstanceOf(MealNotFoundError)
	})

	it('should throw MealNotFoundError when meal belongs to another user', async () => {
		const { id } = mealsRepository.meals[0]

		await expect(
			sut.execute({
				id,
				userId: 'user-2',
				data: { name: 'Updated' }
			})
		).rejects.toBeInstanceOf(MealNotFoundError)
	})
})
