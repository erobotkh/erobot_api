import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import User from './user_model.js'

const categorySchema = mongoose.Schema(
  {
    type: { type: String, default: 'category' },
    name: { type: String, required: true },
    created_by: { type: mongoose.Types.ObjectId, ref: User },
    updated_by: { type: mongoose.Types.ObjectId, ref: User },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

categorySchema.plugin(normalize)
categorySchema.plugin(mongoosePaginate)

const Category = mongoose.model('Category', categorySchema)
export default Category