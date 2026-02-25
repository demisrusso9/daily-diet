import z from 'zod'

export const updateMealSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	date: z.string().optional(),
	isOnDiet: z.boolean().optional()
})

export type UpdateMealDTO = z.infer<typeof updateMealSchema>
