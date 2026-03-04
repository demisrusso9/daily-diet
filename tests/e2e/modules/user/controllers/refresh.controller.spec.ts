import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Controller', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should refresh a session', async () => {
		await request(app.server).post('/users/create').send({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123'
		})

		const sessionResponse = await request(app.server)
			.post('/users/session')
			.send({
				email: 'john.doe@example.com',
				password: 'password123'
			})

		const cookies = sessionResponse.get('Set-Cookie') || []

		const response = await request(app.server)
			.get('/users/refresh')
			.set('Cookie', cookies)
			.send()

		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String)
		})
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken=')
		])
	})
})
