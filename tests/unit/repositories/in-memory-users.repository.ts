import { UserRepository } from '@/modules/user/repositories/contracts/users.repository'
import { RegisterDTO } from '@/modules/user/schemas/register.schema'
import { UserDTO } from '@/modules/user/schemas/user.schema'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UserRepository {
	public users: UserDTO[] = []

	async create(data: RegisterDTO): Promise<UserDTO> {
		const user: UserDTO = {
			id: randomUUID(),
			...data
		}

		this.users.push(user)

		return user
	}

	async findByEmail(email: string): Promise<UserDTO | null> {
		return this.users.find((user) => user.email === email) ?? null
	}
}
