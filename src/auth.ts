import jwt from 'jsonwebtoken'
import { env } from './env'

interface User {
  id: string
  email: string
  password: string
}

export async function generateJwtAndRefreshToken(user: User) {
  const expiresIn = 15

  const accessToken = jwt.sign(user, env.ACCESS_TOKEN_SECRET, { expiresIn })
  const refreshToken = jwt.sign(user, env.REFRESH_TOKEN_SECRET)

  return {
    accessToken,
    refreshToken
  }
}
