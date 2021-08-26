import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (id, email, expiresIn) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: expiresIn.toString(),
  })
}

const generateRefreshToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_REFRESH_SECRET)
}

export { generateToken, generateRefreshToken }