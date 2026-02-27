import z from 'zod'

export const mealSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	date: z.date(),
	isOnDiet: z.boolean(),
	updatedAt: z.date(),
	userId: z.string()
})

export type MealDTO = z.infer<typeof mealSchema>
