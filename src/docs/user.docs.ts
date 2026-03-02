import { registerSchema } from '@/modules/user/schemas/register.schema'
import { sessionSchema } from '@/modules/user/schemas/session.schema'
import z from 'zod'

export const registerDocs = {
	tags: ['Users'],
	summary: 'Cadastrar novo usuário',
	body: registerSchema,
	response: {
		201: z.null().describe('Usuário criado com sucesso'),
		409: z.object({ error: z.string() }).describe('E-mail já cadastrado')
	}
}

export const sessionDocs = {
	tags: ['Users'],
	summary: 'Autenticar usuário e obter token JWT',
	body: sessionSchema,
	response: {
		200: z.object({ token: z.string() }).describe('Token JWT gerado'),
		401: z.object({ error: z.string() }).describe('Credenciais inválidas')
	}
}

export const refreshDocs = {
	tags: ['Users'],
	summary: 'Atualizar token JWT usando refresh token',
	response: {
		200: z
			.object({ token: z.string(), refreshToken: z.string() })
			.describe('Token JWT atualizado'),
		401: z
			.object({ error: z.string() })
			.describe('Refresh token inválido ou expirado')
	}
}
