import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register Controller', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should register a new user', async () => {
		const response = await request(app.server).post('/users/create').send({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123'
		})

		expect(response.status).toBe(201)
	})
})
