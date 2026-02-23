import { User } from '../../../../../prisma/generated/browser'
import { UserCreateInput } from '../../../../../prisma/generated/models'

export interface UserRepository {
	create(data: UserCreateInput): Promise<User>
	findByEmail(email: string): Promise<User | null>
}
