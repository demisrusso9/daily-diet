import { PrismaMealRepository } from '@/modules/meal/repositories/prisma-meal.repository'
import { SummaryService } from '@/modules/meal/services/summary.service'

export function makeSummaryService() {
	const mealsRepository = new PrismaMealRepository()
	const summaryService = new SummaryService(mealsRepository)

	return summaryService
}
