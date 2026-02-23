import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/contracts/users.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

interface RegisterServiceParams {
	name: string
	email: string
	password: string
}

export class RegisterService {
	constructor(private userRepository: UserRepository) {}

	async execute({ name, email, password }: RegisterServiceParams) {
		const checkIfUserExists = await this.userRepository.findByEmail(email)

		if (checkIfUserExists) {
			throw new UserAlreadyExistsError()
		}

		const saltOrRounds = 10
		const hashedPassword = await bcrypt.hash(password, saltOrRounds)

		await this.userRepository.create({
			name,
			email,
			password: hashedPassword
		})
	}
}
