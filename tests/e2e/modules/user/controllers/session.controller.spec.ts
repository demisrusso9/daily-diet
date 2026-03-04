import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Session Controller', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should create a new session', async () => {
		await request(app.server).post('/users/create').send({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123'
		})

		const response = await request(app.server).post('/users/session').send({
			email: 'john.doe@example.com',
			password: 'password123'
		})

		expect(response.status).toBe(200)
		expect(response.body).toEqual(
			expect.objectContaining({
				token: expect.any(String)
			})
		)
	})
})
