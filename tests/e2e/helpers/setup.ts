import { Server } from 'node:http'
import request from 'supertest'

const DEFAULT_USER = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	password: 'password123'
}

export async function createUserAndLogin(server: Server): Promise<string> {
	await request(server).post('/users/create').send(DEFAULT_USER)

	const sessionResponse = await request(server).post('/users/session').send({
		email: DEFAULT_USER.email,
		password: DEFAULT_USER.password
	})

	return sessionResponse.body.token
}

interface CreateMealOptions {
	name: string
	description: string
	isOnDiet: boolean
	date?: string
}

export async function createMeal(
	server: Server,
	token: string,
	meal: CreateMealOptions
): Promise<string> {
	await request(server)
		.post('/meals/create')
		.set('Authorization', `Bearer ${token}`)
		.send({
			...meal,
			date: meal.date ?? new Date().toISOString()
		})

	const listResponse = await request(server)
		.get('/meals/list')
		.set('Authorization', `Bearer ${token}`)

	const meals: Array<{ id: string }> = listResponse.body.meals
	return meals[meals.length - 1].id
}
