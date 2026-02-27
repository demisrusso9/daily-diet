import { UserRepository } from '@/modules/user/repositories/contracts/users.repository'
import { RegisterDTO } from '@/modules/user/schemas/register.schema'
import { UserAlreadyExistsError } from '@/modules/user/services/errors/user-already-exists.error'
import bcrypt from 'bcrypt'

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
