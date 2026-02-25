import { Meal } from '../../../../../prisma/generated/browser'
import {
	MealCreateInput,
	MealUpdateInput
} from '../../../../../prisma/generated/models'

export interface MealsRepository {
	create(data: MealCreateInput): Promise<void>
	update(data: MealUpdateInput, id: string, userId: string): Promise<void>
	getAllMeals(userId: string): Promise<Meal[]>
	findById(id: string, userId: string): Promise<Meal | null>
	deleteById(id: string, userId: string): Promise<void>
	deleteAll(userId: string): Promise<void>
}
