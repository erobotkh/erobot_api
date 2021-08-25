import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = mongoose.Schema(
  {
    type: { type: String, default: 'user' },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: String,
    token: String,
  },
)

userSchema.plugin(normalize)
userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)
export default User