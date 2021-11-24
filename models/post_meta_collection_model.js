import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import Robot from './robot_model.js'
import Member from './member_model.js'

const postMetaCollectionSchema = mongoose.Schema(
  {
    type: { type: String, default: 'category' },
    robots: [{type: mongoose.Types.ObjectId, ref: Robot,}],
    paticipated_members: [{type: mongoose.Types.ObjectId, ref: Member }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

postMetaCollectionSchema.plugin(normalize)
postMetaCollectionSchema.plugin(mongoosePaginate)

const PostMetaCollection = mongoose.model('PostMetaCollection', postMetaCollectionSchema)
export default PostMetaCollection