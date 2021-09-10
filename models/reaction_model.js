import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import User from './user_model.js'

const reactionSchema = mongoose.Schema(
  {
    id: String,
    type: { type: String, default: 'reaction' },
    author: { type: mongoose.Types.ObjectId, ref: User },
    reactionType: {
      type: String,
      enum: ['like', 'love', 'dislike'],
      default: 'like'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    },
  }
)

reactionSchema.plugin(normalize)

const Reaction = mongoose.model('Reaction', reactionSchema)
export default Reaction