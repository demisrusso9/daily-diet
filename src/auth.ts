import jwt from 'jsonwebtoken'
import { env } from './env'

interface User {
  id: string
  email: string
}

export async function generateJwtAndRefreshToken(user: User) {
  const expiresIn = 60 * 5 // 5 minutes

  const accessToken = jwt.sign(user, env.ACCESS_TOKEN_SECRET, { subject: user.email, expiresIn })
  const refreshToken = jwt.sign(user, env.REFRESH_TOKEN_SECRET)

  return {
    accessToken,
    refreshToken
  }
}
