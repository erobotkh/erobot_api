
import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import User from './user_model.js'

const postSchema = mongoose.Schema(
  {
    type: { type: String, default: 'post' },
    title: String,
    body: String,
    author: { type: mongoose.Types.ObjectId, ref: User },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

postSchema.plugin(normalize);
postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);
export default Post