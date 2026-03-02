import { UserRepository } from '@/modules/user/repositories/contracts/users.repository'
import { SessionDTO } from '@/modules/user/schemas/session.schema'
import { InvalidCredentialsError } from '@/modules/user/services/errors/invalid-credentials.error'
import bcrypt from 'bcrypt'

export class SessionService {
	constructor(private userRepository: UserRepository) {}

	async execute({ email, password }: SessionDTO) {
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
