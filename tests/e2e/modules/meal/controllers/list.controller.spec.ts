import { app } from '@/app'
import { createMeal, createUserAndLogin } from '@tests/e2e/helpers/setup'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('List Controller', () => {
	let token: string

	beforeAll(async () => {
		await app.ready()

		token = await createUserAndLogin(app.server)
		await createMeal(app.server, token, {
			name: 'meal1',
			description: 'description1',
			isOnDiet: true
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should list meals', async () => {
		const response = await request(app.server)
			.get('/meals/list')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(200)
		expect(response.body.meals.length).toBeGreaterThan(0)
		expect(response.body.meals[0]).toBeDefined()
	})
})
