
import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import Comment from './comment_model.js'
import Reaction from './reaction_model.js'
import User from './user_model.js'

const imageSchema = mongoose.Schema(
  {
    type: String,
    url: String,
  },
)

const postSchema = mongoose.Schema(
  {
    type: { type: String, default: 'post' },
    title: String,
    body: String,
    images: [imageSchema],
    comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
    reactions: [{ type: mongoose.Types.ObjectId, ref: Reaction }],
    author: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

postSchema.virtual('comment_count', {
  ref: Comment,
  localField: 'comments',
  foreignField: '_id',
  count: true,
})

postSchema.virtual('reaction_count', {
  ref: Reaction,
  localField: 'reactions',
  foreignField: '_id',
  count: true,
})

postSchema.set('toObject', { virtuals: true })
postSchema.set('toJSON', { virtuals: true })

postSchema.plugin(normalize);
postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);
export default Post