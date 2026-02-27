import { RegisterDTO } from '@/modules/user/schemas/register.schema'
import { UserDTO } from '@/modules/user/schemas/user.schema'

export interface UserRepository {
	create(data: RegisterDTO): Promise<UserDTO>
	findByEmail(email: string): Promise<UserDTO | null>
}
