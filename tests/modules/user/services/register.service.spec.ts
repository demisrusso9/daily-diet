import { UserAlreadyExistsError } from '@/modules/user/services/errors/user-already-exists.error'
import { RegisterService } from '@/modules/user/services/register.service'
import { InMemoryUsersRepository } from '@tests/repositories/in-memory-users.repository'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterService(usersRepository)
	})

	it('should register a new user', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456'
		})

		expect(usersRepository.users).toHaveLength(1)
		expect(usersRepository.users[0].email).toBe('john@example.com')
	})

	it('should hash the password before saving', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456'
		})

		const isHashed = await bcrypt.compare(
			'123456',
			usersRepository.users[0].password
		)

		expect(isHashed).toBe(true)
	})

	it('should not register a user with an already existing email', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456'
		})

		await expect(
			sut.execute({
				name: 'Other User',
				email: 'john@example.com',
				password: 'abcdef'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
