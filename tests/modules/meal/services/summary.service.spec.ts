import { SummaryService } from '@/modules/meal/services/summary.service'
import { InMemoryMealsRepository } from '@tests/repositories/in-memory-meals.repository'
import { beforeEach, describe, expect, it } from 'vitest'

let mealsRepository: InMemoryMealsRepository
let sut: SummaryService

describe('Summary Service', () => {
	beforeEach(() => {
		mealsRepository = new InMemoryMealsRepository()
		sut = new SummaryService(mealsRepository)
	})

	it('should return the correct totals', async () => {
		await mealsRepository.create({
			name: 'Frango',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'Pizza',
			description: '',
			date: new Date(),
			isOnDiet: false,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'Salada',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		const summary = await sut.execute({ userId: 'user-1' })

		expect(summary.totalMeals).toBe(3)
		expect(summary.mealsOnDiet).toBe(2)
		expect(summary.mealsOffDiet).toBe(1)
	})

	it('should return the best sequence on diet', async () => {
		await mealsRepository.create({
			name: 'A',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'B',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'C',
			description: '',
			date: new Date(),
			isOnDiet: false,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'D',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'E',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'F',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})

		const summary = await sut.execute({ userId: 'user-1' })

		expect(summary.bestSequenceOnDiet).toBe(3)
	})

	it('should return zeros when user has no meals', async () => {
		const summary = await sut.execute({ userId: 'user-1' })

		expect(summary.totalMeals).toBe(0)
		expect(summary.mealsOnDiet).toBe(0)
		expect(summary.mealsOffDiet).toBe(0)
		expect(summary.bestSequenceOnDiet).toBe(0)
	})

	it('should not include meals from other users', async () => {
		await mealsRepository.create({
			name: 'Frango',
			description: '',
			date: new Date(),
			isOnDiet: true,
			userId: 'user-1'
		})
		await mealsRepository.create({
			name: 'Pizza',
			description: '',
			date: new Date(),
			isOnDiet: false,
			userId: 'user-2'
		})

		const summary = await sut.execute({ userId: 'user-1' })

		expect(summary.totalMeals).toBe(1)
	})
})
