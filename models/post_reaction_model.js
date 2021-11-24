import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import User from './user_model.js'

const postReactionSchema = mongoose.Schema(
  {
    type: { type: String, default: 'reaction' },
    user: { type: mongoose.Types.ObjectId, ref: User, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reactionType: {
      type: String,
      enum: ['like', 'love', 'dislike', 'none'],
      default: 'none'
    },
  },
  {
    timestamps: {
      createdAt: 'created_at'
    },
  }
)

postReactionSchema.plugin(normalize)
postReactionSchema.plugin(mongoosePaginate);

const PostReaction = mongoose.model('PostReaction', postReactionSchema)
export default PostReaction