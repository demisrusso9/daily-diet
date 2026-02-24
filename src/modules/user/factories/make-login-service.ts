import { PrismaUsersRepository } from '../repositories/prisma-users.repository'
import { LoginService } from '../services/login.service'

export function makeLoginService() {
	const userRepository = new PrismaUsersRepository()
	const loginService = new LoginService(userRepository)

	return loginService
}
