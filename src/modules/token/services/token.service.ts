interface JWTPayload {
	sub: string
}

export class TokenService {
	constructor(
		private jwtSign: (payload: JWTPayload, options: object) => string
	) {}

	generateToken(userId: string): string {
		return this.jwtSign({ sub: userId }, { expiresIn: '1d' })
	}
}
