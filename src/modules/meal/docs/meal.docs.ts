import { createMealSchema } from '@/modules/meal/schemas/create.schema'
import { paramsSchema } from '@/modules/meal/schemas/list-id-params.schema'
import { mealSchema } from '@/modules/meal/schemas/meal.schema'
import { updateMealSchema } from '@/modules/meal/schemas/update.schema'
import z from 'zod'

const security = [{ bearerAuth: [] }]
const unauthorizedResponse = z
	.object({ error: z.string() })
	.describe('Não autenticado')
const notFoundResponse = z
	.object({ message: z.string() })
	.describe('Refeição não encontrada')

export const listMealsDocs = {
	tags: ['Meals'],
	summary: 'Listar todas as refeições do usuário',
	security,
	response: {
		200: z.object({ meals: z.array(mealSchema) }),
		401: unauthorizedResponse
	}
}

export const getMealByIdDocs = {
	tags: ['Meals'],
	summary: 'Buscar refeição por ID',
	security,
	params: paramsSchema,
	response: {
		200: z.object({ meal: mealSchema }),
		401: unauthorizedResponse,
		404: notFoundResponse
	}
}

export const summaryDocs = {
	tags: ['Meals'],
	summary: 'Resumo e métricas das refeições do usuário',
	security,
	response: {
		200: z.object({
			totalMeals: z.number().describe('Total de refeições registradas'),
			mealsOnDiet: z.number().describe('Total de refeições dentro da dieta'),
			mealsOffDiet: z.number().describe('Total de refeições fora da dieta'),
			bestSequenceOnDiet: z
				.number()
				.describe('Melhor sequência consecutiva dentro da dieta')
		}),
		401: unauthorizedResponse
	}
}

export const createMealDocs = {
	tags: ['Meals'],
	summary: 'Criar nova refeição',
	security,
	body: createMealSchema,
	response: {
		201: z.object({ message: z.string() }),
		401: unauthorizedResponse
	}
}

export const updateMealDocs = {
	tags: ['Meals'],
	summary: 'Atualizar refeição existente',
	security,
	params: paramsSchema,
	body: updateMealSchema,
	response: {
		201: z.object({ message: z.string() }),
		401: unauthorizedResponse,
		404: notFoundResponse
	}
}

export const deleteMealDocs = {
	tags: ['Meals'],
	summary: 'Deletar refeição por ID',
	security,
	params: paramsSchema,
	response: {
		200: z.null(),
		401: unauthorizedResponse,
		404: notFoundResponse
	}
}

export const deleteAllMealsDocs = {
	tags: ['Meals'],
	summary: 'Deletar todas as refeições do usuário',
	security,
	response: {
		200: z.null(),
		401: unauthorizedResponse
	}
}
