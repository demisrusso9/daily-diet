import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createUserAndLogin } from '../helpers/setup'

describe('Check if user is authenticated middleware', () => {
	let token: string

	beforeAll(async () => {
		await app.ready()

		token = await createUserAndLogin(app.server)
	})

	afterAll(async () => {
		await app.close()
	})

	it('should return 401 if the user is not authenticated', async () => {
		const response = await request(app.server).get('/meals/list').send()

		expect(response.status).toBe(401)
		expect(response.body).toEqual({ error: 'Unauthorized' })
	})

	it('should allow access if the user is authenticated', async () => {
		const response = await request(app.server)
			.get('/meals/list')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toBe(200)
	})
})
