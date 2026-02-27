import { CreateService } from '@/modules/meal/services/create.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { InMemoryUsersRepository } from '@tests/repositories/in-memory-users.repository'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let mealsRepository: InMemoryMealsRepository
let sut: CreateService

describe('Create Service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		mealsRepository = new InMemoryMealsRepository()

		sut = new CreateService(mealsRepository)

		usersRepository.users.push({
			id: 'user-1',
			name: 'John Doe',
			email: 'john@example.com',
			password: bcrypt.hashSync('123456', 10)
		})
	})

	it('should create a new meal', async () => {
		await sut.execute({
			name: 'Salad',
			description: 'A healthy salad',
			date: new Date('2023-01-01'),
			isOnDiet: true,
			userId: 'user-1'
		})

		expect(mealsRepository.meals).toHaveLength(1)
		expect(mealsRepository.meals[0].name).toBe('Salad')
	})
})
