import { app } from '@/app'
import { createMeal, createUserAndLogin } from '@tests/e2e/helpers/setup'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Delete All Controller', () => {
	let token: string
	let paramId: string

	beforeAll(async () => {
		await app.ready()
		token = await createUserAndLogin(app.server)

		paramId = await createMeal(app.server, token, {
			name: 'meal1',
			description: 'description1',
			isOnDiet: true
		})
	})

	afterAll(async () => {
		await app.close()
	})

	it('should delete meal by id', async () => {
		const response = await request(app.server)
			.delete(`/meals/delete/${paramId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toEqual(200)
	})
})
