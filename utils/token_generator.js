import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (id, email, expiresIn) => {
  return jsonwebtoken.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  })
}

const generateRefreshToken = (id, email) => {
  return jsonwebtoken.sign({ id, email }, process.env.JWT_REFRESH_SECRET)
}

export { generateToken, generateRefreshToken }