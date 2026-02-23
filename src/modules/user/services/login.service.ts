import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/contracts/users.repository'
import { LoginDTO } from '../schemas/login.schema'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

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
