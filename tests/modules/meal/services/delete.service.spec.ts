import { DeleteService } from '@/modules/meal/services/delete.service'
import { MealNotFoundError } from '@/modules/meal/services/errors/meal-not-found.error'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { InMemoryUsersRepository } from '@tests/repositories/in-memory-users.repository'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let mealsRepository: InMemoryMealsRepository
let sut: DeleteService

describe('Delete Service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		mealsRepository = new InMemoryMealsRepository()

		sut = new DeleteService(mealsRepository)

		usersRepository.users.push({
			id: 'user-1',
			name: 'John Doe',
			email: 'john@example.com',
			password: bcrypt.hashSync('123456', 10)
		})
	})

	it('should delete a meal by id', async () => {
		const meal = {
			id: 'meal-1',
			name: 'Salad',
			description: 'A healthy salad',
			date: new Date('2023-01-01'),
			updatedAt: new Date('2023-01-01'),
			isOnDiet: true,
			userId: 'user-1'
		}

		mealsRepository.meals.push(meal)

		await sut.execute({
			id: 'meal-1',
			userId: 'user-1'
		})

		expect(mealsRepository.meals).toHaveLength(0)
	})

	it('should not delete a meal if it does not exist', async () => {
		await expect(
			sut.execute({
				id: 'meal-1',
				userId: 'user-1'
			})
		).rejects.toBeInstanceOf(MealNotFoundError)
	})
})
