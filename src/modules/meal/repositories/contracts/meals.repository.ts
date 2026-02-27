import { CreateMealDTO } from '@/modules/meal/schema/create.schema'
import { MealDTO } from '@/modules/meal/schema/meal.schema'
import { UpdateMealDTO } from '@/modules/meal/schema/update.schema'

export interface MealsRepository {
	create(data: CreateMealDTO & { userId: string }): Promise<void>
	update(data: UpdateMealDTO, id: string, userId: string): Promise<void>
	getAllMeals(userId: string): Promise<MealDTO[]>
	findById(id: string, userId: string): Promise<MealDTO | null>
	deleteById(id: string, userId: string): Promise<void>
	deleteAll(userId: string): Promise<void>
}
