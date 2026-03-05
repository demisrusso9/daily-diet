import { app } from '@/app'
import { createUserAndLogin } from '@tests/e2e/helpers/setup'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Controller', () => {
	let token: string

	beforeAll(async () => {
		await app.ready()
		token = await createUserAndLogin(app.server)
	})

	afterAll(async () => {
		await app.close()
	})

	it('should create a meal', async () => {
		const response = await request(app.server)
			.post('/meals/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'meal1',
				description: 'description1',
				isOnDiet: true,
				date: new Date().toISOString()
			})

		expect(response.status).toEqual(201)
		expect(response.body).toEqual({
			message: 'Meal created successfully'
		})
	})
})
