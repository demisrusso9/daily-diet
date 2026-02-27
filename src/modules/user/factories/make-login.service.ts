import { PrismaUsersRepository } from '@/modules/user/repositories/prisma-users.repository'
import { LoginService } from '@/modules/user/services/login.service'

export function makeLoginService() {
	const userRepository = new PrismaUsersRepository()
	const loginService = new LoginService(userRepository)

	return loginService
}
