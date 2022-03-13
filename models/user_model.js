import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import Member from './member_model.js'

const userSchema = mongoose.Schema(
  {
    username: { type: String, unique: true },
    type: {
      type: String,
      enum: ['user', 'admin', 'editor'],
      default: 'user',
      required: true,
    },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    profile_url: { type: String, default: null },
    email: { type: String, unique: true },
    member: { type: mongoose.Types.ObjectId, ref: Member },
    // select: false so it won't return.
    // Note: use +password to get it: Users.findById(id).select('+password')
    password: { type: String, select: false },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

userSchema.plugin(normalize)
userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)
export default User