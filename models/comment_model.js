import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import User from './user_model.js'

const commentSchema = mongoose.Schema(
  {
    type: { type: String, default: 'comment' },
    user: { type: mongoose.Types.ObjectId, ref: User },
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

commentSchema.plugin(normalize)
commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema)
export default Comment