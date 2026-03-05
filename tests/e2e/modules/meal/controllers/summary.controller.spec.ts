import { app } from '@/app'
import { createMeal, createUserAndLogin } from '@tests/e2e/helpers/setup'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Summary Controller', () => {
	let token: string

	beforeAll(async () => {
		await app.ready()
		token = await createUserAndLogin(app.server)
		await createMeal(app.server, token, {
			name: 'meal1',
			description: 'description1',
			isOnDiet: true
		})
		await createMeal(app.server, token, {
			name: 'meal2',
			description: 'description2',
			isOnDiet: false
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should get summary of meals', async () => {
		const response = await request(app.server)
			.get('/meals/summary')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			totalMeals: 2,
			mealsOnDiet: 1,
			mealsOffDiet: 1,
			bestSequenceOnDiet: 1
		})
	})
})
