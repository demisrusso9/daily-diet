import { PrismaUsersRepository } from '@/modules/user/repositories/prisma-users.repository'
import { SessionService } from '@/modules/user/services/session.service'

export function makeSessionService() {
	const userRepository = new PrismaUsersRepository()
	const sessionService = new SessionService(userRepository)

	return sessionService
}
