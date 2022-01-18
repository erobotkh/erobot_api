import mongoose from 'mongoose'

const socialSchema = mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['google', 'telegram', 'facebook', 'phone'],
      required: true,
    },
    href: { type: String, unique: true },
  },
)

export default socialSchema