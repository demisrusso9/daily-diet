import { InvalidCredentialsError } from '@/modules/user/services/errors/invalid-credentials.error'
import { LoginService } from '@/modules/user/services/login.service'
import { InMemoryUsersRepository } from '@tests/repositories/in-memory-users.repository'
import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: LoginService

describe('Login Service', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository()
		sut = new LoginService(usersRepository)

		usersRepository.users.push({
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			password: await bcrypt.hash('123456', 10)
		})
	})

	it('should login a user', async () => {
		const user = await sut.execute({
			email: 'john@example.com',
			password: '123456'
		})

		expect(user.email).toBe('john@example.com')
	})

	it('should not login with an incorrect password', async () => {
		await expect(
			sut.execute({
				email: 'john@example.com',
				password: 'wrong-password'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not login with a non-existing email', async () => {
		await expect(
			sut.execute({
				email: 'notfound@example.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
