import z from 'zod'

export const mealSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	date: z.string(),
	isOnDiet: z.boolean(),
	updatedAt: z.string(),
	userId: z.string()
})

export type MealDTO = z.infer<typeof mealSchema>
