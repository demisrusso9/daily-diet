import { loginSchema } from '@/modules/user/schemas/login.schema'
import { registerSchema } from '@/modules/user/schemas/register.schema'
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

export const loginDocs = {
	tags: ['Users'],
	summary: 'Autenticar usuário e obter token JWT',
	body: loginSchema,
	response: {
		200: z.object({ token: z.string() }).describe('Token JWT gerado'),
		401: z.object({ error: z.string() }).describe('Credenciais inválidas')
	}
}
