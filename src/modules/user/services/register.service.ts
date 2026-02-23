import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/contracts/users.repository'
import { RegisterDTO } from '../schemas/register.schema'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

export class RegisterService {
	constructor(private userRepository: UserRepository) {}

	async execute({ name, email, password }: RegisterDTO) {
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
