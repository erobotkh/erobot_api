
import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import Comment from './comment_model.js'
import PostReaction from './post_reaction_model.js'
import Category from './category_model.js'
import User from './user_model.js'
import PostMetaCollection from './post_meta_collection_model.js';
import imageSchema from './schema/image_schema.js';

const postSchema = mongoose.Schema(
  {
    type: { type: String, default: 'post' },
    title: String,
    body: String,
    images: [imageSchema],
    comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
    reactions: [{ type: mongoose.Types.ObjectId, ref: PostReaction }],
    category: { type: mongoose.Types.ObjectId, ref: Category },
    tags: [{ type: String }],
    meta_collection: { type: mongoose.Types.ObjectId, ref: PostMetaCollection },
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
  foreignField: '',
  count: true,
})

postSchema.virtual('comment_count')
  .get(function () {
    return this.comments.length
  })

postSchema.virtual('reaction_count')
  .get(function () {
    return this.reactions.length
  })

postSchema.set('toObject', { virtuals: true })
postSchema.set('toJSON', { virtuals: true })

postSchema.plugin(normalize);
postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);
export default Post