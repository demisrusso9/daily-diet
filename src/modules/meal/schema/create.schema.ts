import z from 'zod'

export const createMealSchema = z.object({
	name: z.string(),
	description: z.string(),
	date: z.string(),
	isOnDiet: z.boolean()
})

export type CreateMealDTO = z.infer<typeof createMealSchema>
