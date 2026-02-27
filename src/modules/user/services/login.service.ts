import { UserRepository } from '@/modules/user/repositories/contracts/users.repository'
import { LoginDTO } from '@/modules/user/schemas/login.schema'
import { InvalidCredentialsError } from '@/modules/user/services/errors/invalid-credentials.error'
import bcrypt from 'bcrypt'

export class LoginService {
	constructor(private userRepository: UserRepository) {}

	async execute({ email, password }: LoginDTO) {
		const user = await this.userRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatches = await bcrypt.compare(password, user.password)

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return user
	}
}
