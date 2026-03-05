import { app } from '@/app'
import { createMeal, createUserAndLogin } from '@tests/e2e/helpers/setup'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Delete All Controller', () => {
	let token: string

	beforeAll(async () => {
		await app.ready()
		token = await createUserAndLogin(app.server)

		await createMeal(app.server, token, {
			name: 'meal1',
			description: 'description1',
			isOnDiet: true,
			date: new Date().toISOString()
		})

		await createMeal(app.server, token, {
			name: 'meal2',
			description: 'description2',
			isOnDiet: false,
			date: new Date().toISOString()
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should delete all meals', async () => {
		const response = await request(app.server)
			.delete('/meals/delete-all')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(200)
	})
})
