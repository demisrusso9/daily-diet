import { prisma } from '@/lib/prisma'
import { UserRepository } from '@/modules/user/repositories/contracts/users.repository'
import { RegisterDTO } from '@/modules/user/schemas/register.schema'

export class PrismaUsersRepository implements UserRepository {
	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: { email }
		})

		return user
	}

	async create(data: RegisterDTO) {
		const user = await prisma.user.create({
			data
		})

		return user
	}
}
