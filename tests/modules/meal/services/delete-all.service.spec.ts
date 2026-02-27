import { DeleteAllService } from '@/modules/meal/services/delete-all.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { InMemoryUsersRepository } from '@tests/repositories/in-memory-users.repository'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let mealsRepository: InMemoryMealsRepository
let sut: DeleteAllService

describe('Delete All Service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		mealsRepository = new InMemoryMealsRepository()

		sut = new DeleteAllService(mealsRepository)

		usersRepository.users.push({
			id: 'user-1',
			name: 'John Doe',
			email: 'john@example.com',
			password: bcrypt.hashSync('123456', 10)
		})
	})

	it('should delete all meals for a user', async () => {
		await sut.execute({
			userId: 'user-1'
		})

		expect(mealsRepository.meals).toHaveLength(0)
	})
})
