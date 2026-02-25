import { PrismaMealRepository } from '../repositories/prisma-meal.repository'
import { SummaryService } from '../services/summary.service'

export function makeSummaryService() {
	const mealsRepository = new PrismaMealRepository()
	const summaryService = new SummaryService(mealsRepository)

	return summaryService
}
