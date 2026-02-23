import { UserCreateInput } from '../../../../prisma/generated/models'
import { prisma } from '../../../lib/prisma'
import { UserRepository } from './contracts/users.repository'

export class PrismaUsersRepository implements UserRepository {
	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: { email }
		})

		return user
	}

	async create(data: UserCreateInput) {
		const user = await prisma.user.create({
			data
		})

		return user
	}
}
