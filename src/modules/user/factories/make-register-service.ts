import { PrismaUsersRepository } from '@/modules/user/repositories/prisma-users.repository'
import { RegisterService } from '@/modules/user/services/register.service'

export function makeRegisterService() {
	const userRepository = new PrismaUsersRepository()
	const registerService = new RegisterService(userRepository)

	return registerService
}
